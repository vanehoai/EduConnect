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
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';

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
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold text-destructive">Không có quyền truy cập</h1>
          <p className="mt-2 text-destructive/80">
            Tài khoản hiện tại không có quyền {config.readPermission}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const rows = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description}>
        {config.extraActions}
        {can(config.createPermission) && (
          <Button onClick={() => setEditing(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between">
            <form
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={(event) => {
                event.preventDefault();
                setPage(1);
                setSearch(searchInput.trim());
              }}
            >
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  aria-label="Tìm kiếm"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="pl-9 bg-muted/50"
                  placeholder="Tìm kiếm..."
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
                  className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>

              <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                Lọc
              </Button>
            </form>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                {(config.detailPath ||
                  can(config.updatePermission) ||
                  can(config.deletePermission)) && (
                  <TableHead className="text-right">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {listQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={config.columns.length + 1} className="h-32 text-center">
                    <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                  </TableCell>
                </TableRow>
              ) : listQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 1}
                    className="h-32 text-center text-destructive"
                  >
                    {errorMessage(listQuery.error)}
                  </TableCell>
                </TableRow>
              ) : !rows.length ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 1}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Không tìm thấy dữ liệu phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={String(row.id)}>
                    {config.columns.map((column) => {
                      const value = nestedValue(row, column.key);
                      return (
                        <TableCell key={column.key}>
                          {column.format ? column.format(value, row) : displayValue(value)}
                        </TableCell>
                      );
                    })}
                    {(config.detailPath ||
                      can(config.updatePermission) ||
                      can(config.deletePermission)) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {config.detailPath && (
                            <Button asChild size="icon" variant="ghost" title="Chi tiết">
                              <Link href={config.detailPath(row)}>
                                <BookOpen className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {row.deletedAt && can(config.updatePermission) ? (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Khôi phục"
                              onClick={() => restoreMutation.mutate(String(row.id))}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <>
                              {can(config.updatePermission) && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title="Chỉnh sửa"
                                  onClick={() => setEditing(row)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {can(config.deletePermission) && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title="Xóa"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Bạn có chắc chắn muốn xóa ${config.entityLabel} này?`,
                                      )
                                    )
                                      removeMutation.mutate(String(row.id));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              {meta ? (
                <>
                  Hiển thị <span className="font-medium">{rows.length}</span> /{' '}
                  <span className="font-medium">{meta.total}</span> bản ghi
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Trang {meta?.page ?? 1} / {Math.max(meta?.totalPages ?? 1, 1)}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={!meta || page >= meta.totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResourceDialog
        open={editing !== undefined}
        config={config}
        row={editing || null}
        lookupOptions={lookupOptions}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          void invalidate();
        }}
      />
    </div>
  );
}

function ResourceDialog({
  open,
  config,
  row,
  lookupOptions,
  onClose,
  onSaved,
}: {
  open: boolean;
  config: ResourcePageConfig;
  row: Row | null;
  lookupOptions: Map<string, ResourceOption[]>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const fields = config.fields.filter((field) => !(row && field.createOnly));
  const schema = useMemo(() => schemaFor(fields), [fields, row]);

  const defaults = useMemo(() => {
    return Object.fromEntries(
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
  }, [fields, row]);

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
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {row ? `Cập nhật ${config.entityLabel}` : `Thêm mới ${config.entityLabel}`}
          </DialogTitle>
        </DialogHeader>

        <form
          id="resource-form"
          className="grid gap-6 py-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {fields.map((field) => {
            const options = field.options ?? lookupOptions.get(field.name);
            const error = form.formState.errors[field.name]?.message;
            return (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={field.name} className="mb-2 block">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>

                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="flex h-10 items-center">
                    <input
                      id={field.name}
                      type="checkbox"
                      className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                      {...form.register(field.name)}
                    />
                  </div>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? 'text'}
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                  />
                )}
                {error && (
                  <span className="mt-1.5 block text-xs font-medium text-destructive">
                    {String(error)}
                  </span>
                )}
              </div>
            );
          })}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form="resource-form" disabled={mutation.isPending}>
            {mutation.isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
