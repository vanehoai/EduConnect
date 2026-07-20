'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getServiceRequestCategories,
  createServiceRequestCategory,
  updateServiceRequestCategory,
  type CreateCategoryInput,
} from '@/lib/services/service-request.service';
import type { ServiceRequestCategoryDto, ServiceRequestPriority } from '@school/shared-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Loader2 } from 'lucide-react';

interface FormState {
  code: string;
  name: string;
  description: string;
  defaultPriority: ServiceRequestPriority;
  slaHours: string;
  requiresAttachment: boolean;
  isActive: boolean;
}

const DEFAULT_FORM: FormState = {
  code: '',
  name: '',
  description: '',
  defaultPriority: 'NORMAL',
  slaHours: '',
  requiresAttachment: false,
  isActive: true,
};

export default function ServiceRequestCategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ServiceRequestCategoryDto | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['service-request-categories'],
    queryFn: getServiceRequestCategories,
  });

  const createMutation = useMutation({
    mutationFn: createServiceRequestCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-categories'] });
      setShowForm(false);
      setForm(DEFAULT_FORM);
      toast.success('Đã tạo danh mục');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) =>
      updateServiceRequestCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-categories'] });
      setShowForm(false);
      setEditItem(null);
      setForm(DEFAULT_FORM);
      toast.success('Đã cập nhật danh mục');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEdit(cat: ServiceRequestCategoryDto) {
    setEditItem(cat);
    setForm({
      code: cat.code,
      name: cat.name,
      description: cat.description ?? '',
      defaultPriority: cat.defaultPriority,
      slaHours: cat.slaHours !== null && cat.slaHours !== undefined ? String(cat.slaHours) : '',
      requiresAttachment: cat.requiresAttachment,
      isActive: cat.isActive,
    });
    setShowForm(true);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.code.trim()) e.code = 'Mã bắt buộc';
    if (!form.name.trim()) e.name = 'Tên bắt buộc';
    if (form.slaHours && isNaN(Number(form.slaHours))) e.slaHours = 'SLA phải là số';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit() {
    if (!validate()) return;
    const payload: CreateCategoryInput = {
      code: form.code,
      name: form.name,
      description: form.description || undefined,
      defaultPriority: form.defaultPriority,
      slaHours: form.slaHours ? Number(form.slaHours) : undefined,
      requiresAttachment: form.requiresAttachment,
      isActive: form.isActive,
    };
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Danh mục yêu cầu</h1>
          <p className="text-muted-foreground">Cấu hình các loại yêu cầu dịch vụ</p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            setForm(DEFAULT_FORM);
            setErrors({});
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Ưu tiên mặc định</TableHead>
              <TableHead>SLA (giờ)</TableHead>
              <TableHead>Yêu cầu đính kèm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Chưa có danh mục nào
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-sm">{cat.code}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.defaultPriority}</TableCell>
                  <TableCell>{cat.slaHours ?? '—'}</TableCell>
                  <TableCell>{cat.requiresAttachment ? 'Có' : 'Không'}</TableCell>
                  <TableCell>
                    <Badge variant={cat.isActive ? 'default' : 'secondary'}>
                      {cat.isActive ? 'Hoạt động' : 'Tắt'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-code">Mã *</Label>
                <Input
                  id="cat-code"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  disabled={!!editItem}
                />
                {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-name">Tên *</Label>
                <Input
                  id="cat-name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Mô tả</Label>
              <Textarea
                id="cat-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ưu tiên mặc định</Label>
                <Select
                  value={form.defaultPriority}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, defaultPriority: v as ServiceRequestPriority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as ServiceRequestPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-sla">SLA (giờ)</Label>
                <Input
                  id="cat-sla"
                  type="number"
                  min={0}
                  value={form.slaHours}
                  onChange={(e) => setForm((prev) => ({ ...prev, slaHours: e.target.value }))}
                />
                {errors.slaHours && <p className="text-sm text-destructive">{errors.slaHours}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Yêu cầu tệp đính kèm</Label>
              <Switch
                checked={form.requiresAttachment}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, requiresAttachment: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Kích hoạt</Label>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
                setForm(DEFAULT_FORM);
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editItem ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
