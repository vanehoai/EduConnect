'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { PermissionCode } from '@school/shared-types';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiClientError, apiRequest, apiRequestEnvelope } from '@/lib/api-client';
import { useCurrentUser } from '@/lib/auth';

type Row = Record<string, unknown>;
type FormValue = string | boolean;
type FormValues = Record<string, FormValue>;

export interface ResourceOption {
  value: string;
  label: string;
}
export interface ResourceField {
  name: string;
  label: string;
  type?:
    'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  createOnly?: boolean;
  placeholder?: string;
  options?: ResourceOption[];
  lookup?: { endpoint: string; valueKey?: string; labelKeys: string[] };
}
export interface ResourceColumn {
  key: string;
  label: string;
  format?: (value: unknown, row: Row) => string;
}
export interface ResourceFilter {
  name: string;
  label: string;
  options: ResourceOption[];
}
export interface ResourcePageConfig {
  title: string;
  description: string;
  endpoint: string;
  entityLabel: string;
  readPermission: PermissionCode;
  createPermission?: PermissionCode;
  updatePermission?: PermissionCode;
  deletePermission?: PermissionCode;
  columns: ResourceColumn[];
  fields: ResourceField[];
  filters?: ResourceFilter[];
  sortOptions: ResourceOption[];
  defaultSort: string;
  detailPath?: (row: Row) => string;
  extraActions?: React.ReactNode;
}

function nestedValue(row: Row, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined,
      row,
    );
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))
    return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
  return String(value);
}

function schemaFor(fields: ResourceField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.type === 'checkbox') {
      shape[field.name] = z.boolean();
      continue;
    }
    let validator = z.string();
    if (field.required)
      validator = validator.trim().min(1, `Vui lòng nhập ${field.label.toLowerCase()}`);
    if (field.type === 'email')
      validator = validator.refine(
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'Email không đúng định dạng',
      );
    if (field.type === 'number')
      validator = validator.refine(
        (value) => !value || Number.isFinite(Number(value)),
        'Giá trị phải là số hợp lệ',
      );
    shape[field.name] = validator;
  }
  return z.object(shape);
}

function errorMessage(error: unknown): string {
  return error instanceof ApiClientError
    ? error.message
    : 'Không thể hoàn tất thao tác. Vui lòng thử lại.';
}

export function ResourcePage({ config }: { config: ResourcePageConfig }) {
  const userQuery = useCurrentUser();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(config.defaultSort);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Row | null | undefined>(undefined);

  const params = new URLSearchParams({ page: String(page), limit: '20', sortBy, sortOrder });
  if (search) params.set('search', search);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const listQuery = useQuery({
    queryKey: ['resource', config.endpoint, page, search, sortBy, sortOrder, filters],
    queryFn: () => apiRequestEnvelope<Row[]>(`${config.endpoint}?${params}`),
    enabled: Boolean(userQuery.data?.permissions.includes(config.readPermission)),
  });

  const lookupFields = config.fields.filter((field) => field.lookup);
  const lookupQueries = useQueries({
    queries: lookupFields.map((field) => ({
      queryKey: ['lookup', field.lookup!.endpoint],
      queryFn: () => apiRequestEnvelope<Row[]>(field.lookup!.endpoint),
      staleTime: 60_000,
    })),
  });
  const lookupOptions = useMemo(() => {
    const result = new Map<string, ResourceOption[]>();
    lookupFields.forEach((field, index) => {
      const lookup = field.lookup!;
      result.set(
        field.name,
        (lookupQueries[index]?.data?.data ?? []).map((row) => ({
          value: String(row[lookup.valueKey ?? 'id']),
          label: lookup.labelKeys.map((key) => displayValue(nestedValue(row, key))).join(' · '),
        })),
      );
    });
    return result;
  }, [lookupFields, lookupQueries]);

  const can = (permission?: PermissionCode) =>
    Boolean(permission && userQuery.data?.permissions.includes(permission));
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['resource', config.endpoint] });
  const removeMutation = useMutation({
    mutationFn: (id: string) => apiRequest<null>(`${config.endpoint}/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success(`Đã xóa ${config.entityLabel}`);
      void invalidate();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const restoreMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<Row>(`${config.endpoint}/${id}/restore`, { method: 'POST' }),
    onSuccess: () => {
      toast.success(`Đã khôi phục ${config.entityLabel}`);
      void invalidate();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!userQuery.data?.permissions.includes(config.readPermission)) {
    return (
      <Card>
        <CardContent>
          <h1 className="text-xl font-semibold">Không có quyền truy cập</h1>
          <p className="mt-2 text-slate-600">
            Tài khoản hiện tại không có quyền {config.readPermission}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const rows = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{config.title}</h1>
          <p className="mt-1 text-slate-600">{config.description}</p>
        </div>
        <div className="flex gap-2">
          {config.extraActions}
          {can(config.createPermission) ? (
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setSearch(searchInput.trim());
            }}
          >
            <div className="relative min-w-60 flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                aria-label="Tìm kiếm"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm"
                placeholder="Tìm theo mã, tên hoặc email..."
              />
            </div>
            {(config.filters ?? []).map((filter) => (
              <select
                key={filter.name}
                aria-label={filter.label}
                value={filters[filter.name] ?? ''}
                onChange={(event) => {
                  setPage(1);
                  setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
                }}
                className="h-10 rounded-md border bg-white px-3 text-sm"
              >
                <option value="">{filter.label}: Tất cả</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            <select
              aria-label="Sắp xếp"
              value={sortBy}
              onChange={(event) => {
                setPage(1);
                setSortBy(event.target.value);
              }}
              className="h-10 rounded-md border bg-white px-3 text-sm"
            >
              {config.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sắp xếp: {option.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Thứ tự"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="h-10 rounded-md border bg-white px-3 text-sm"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
            <Button type="submit" variant="outline">
              Tìm
            </Button>
          </form>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-medium">
                      {column.label}
                    </th>
                  ))}
                  {config.detailPath ||
                  can(config.updatePermission) ||
                  can(config.deletePermission) ? (
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y">
                {listQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : listQuery.isError ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="px-4 py-10 text-center text-red-600"
                    >
                      {errorMessage(listQuery.error)}
                    </td>
                  </tr>
                ) : !rows.length ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Không có dữ liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={String(row.id)} className="hover:bg-slate-50/70">
                      {config.columns.map((column) => {
                        const value = nestedValue(row, column.key);
                        return (
                          <td key={column.key} className="px-4 py-3">
                            {column.format ? column.format(value, row) : displayValue(value)}
                          </td>
                        );
                      })}
                      {config.detailPath ||
                      can(config.updatePermission) ||
                      can(config.deletePermission) ? (
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            {config.detailPath ? (
                              <Button asChild size="default" variant="outline" title="Chi tiết">
                                <Link href={config.detailPath(row)}>
                                  <BookOpen className="h-4 w-4" />
                                </Link>
                              </Button>
                            ) : null}
                            {row.deletedAt && can(config.updatePermission) ? (
                              <Button
                                size="default"
                                variant="outline"
                                title="Khôi phục"
                                onClick={() => restoreMutation.mutate(String(row.id))}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                {can(config.updatePermission) ? (
                                  <Button
                                    size="default"
                                    variant="outline"
                                    title="Chỉnh sửa"
                                    onClick={() => setEditing(row)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                ) : null}
                                {can(config.deletePermission) ? (
                                  <Button
                                    size="default"
                                    variant="outline"
                                    title="Xóa"
                                    onClick={() => {
                                      if (window.confirm(`Xóa ${config.entityLabel} này?`))
                                        removeMutation.mutate(String(row.id));
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              {meta
                ? `${meta.total} bản ghi · Trang ${meta.page}/${Math.max(meta.totalPages, 1)}`
                : ''}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                disabled={!meta || page >= meta.totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {editing !== undefined ? (
        <ResourceDialog
          config={config}
          row={editing}
          lookupOptions={lookupOptions}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            void invalidate();
          }}
        />
      ) : null}
    </section>
  );
}

function ResourceDialog({
  config,
  row,
  lookupOptions,
  onClose,
  onSaved,
}: {
  config: ResourcePageConfig;
  row: Row | null;
  lookupOptions: Map<string, ResourceOption[]>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const fields = config.fields.filter((field) => !(row && field.createOnly));
  const schema = useMemo(() => schemaFor(fields), [fields]);
  const defaults = Object.fromEntries(
    fields.map((field) => {
      const raw = row ? nestedValue(row, field.name) : undefined;
      const value =
        field.type === 'checkbox'
          ? Boolean(raw)
          : raw == null
            ? ''
            : field.type === 'date'
              ? String(raw).slice(0, 10)
              : field.type === 'datetime-local'
                ? String(raw).slice(0, 16)
                : String(raw);
      return [field.name, value];
    }),
  ) as FormValues;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: defaults,
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const body: Record<string, unknown> = {};
      for (const field of fields) {
        const value = values[field.name];
        if (value === '' && !field.required) continue;
        body[field.name] = field.type === 'number' && value !== '' ? Number(value) : value;
      }
      return apiRequest<Row>(row ? `${config.endpoint}/${String(row.id)}` : config.endpoint, {
        method: row ? 'PATCH' : 'POST',
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast.success(row ? `Đã cập nhật ${config.entityLabel}` : `Đã tạo ${config.entityLabel}`);
      onSaved();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            {row ? `Cập nhật ${config.entityLabel}` : `Thêm ${config.entityLabel}`}
          </h2>
          <button onClick={onClose} aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          className="grid gap-4 p-6 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {fields.map((field) => {
            const options = field.options ?? lookupOptions.get(field.name);
            const error = form.formState.errors[field.name]?.message;
            return (
              <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <span className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
                {field.type === 'textarea' ? (
                  <textarea
                    className="min-h-24 w-full rounded-md border p-3 text-sm"
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                    {...form.register(field.name)}
                  >
                    <option value="">-- Chọn --</option>
                    {(options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input type="checkbox" className="h-5 w-5" {...form.register(field.name)} />
                ) : (
                  <input
                    type={field.type ?? 'text'}
                    className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                  />
                )}
                {error ? (
                  <span className="mt-1 block text-sm text-red-600">{String(error)}</span>
                ) : null}
              </label>
            );
          })}
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
