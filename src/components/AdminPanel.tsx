"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createSupabaseClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Tables = Database['public']['Tables'];
type Peak = Tables['peaks']['Row'];
type Trail = Tables['trails']['Row'];
type Story = Tables['stories']['Row'];
type Expedition = Tables['expeditions']['Row'];
type AdminContent = Peak | Trail | Story | Expedition;

interface AdminPanelProps {
  show: boolean;
  onClose: () => void;
}

const AdminPanel = ({ show, onClose }: AdminPanelProps) => {
  const { user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('trails');
  const [content, setContent] = useState<AdminContent[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<AdminContent> | null>(null);
  const supabase = createSupabaseClient();

  const refetch = async () => {
    if (!supabase) return;
    setContentLoading(true);
    const { data } = await supabase.from(selectedTab).select('*');
    setContent(data || []);
    setContentLoading(false);
  };

  useEffect(() => {
    refetch();
  }, [selectedTab]);

  const handleEdit = (item: AdminContent) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from(selectedTab).delete().eq('id', id);
      if (error) {
        alert('Error deleting item: ' + error.message);
      } else {
        refetch();
      }
    }
  };

  const handleNew = () => {
    setEditingItem({});
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !editingItem) return;

    const { id, created_at, updated_at, ...upsertData } = editingItem as AdminContent & { [key: string]: string | number | boolean | string[] | null };

    const { error } = await supabase.from(selectedTab).upsert(upsertData);

    if (error) {
      alert('Error saving item: ' + error.message);
    } else {
      setEditingItem(null);
      refetch();
    }
  };
  
  const getTitle = (item: Partial<AdminContent>) => ('title' in item ? item.title : 'name' in item ? item.name : '');
  const getDescription = (item: Partial<AdminContent>) => ('description' in item ? item.description : '');
  const getImageUrl = (item: Partial<AdminContent>) => ('image_url' in item ? item.image_url : '');
  const getId = (item: Partial<AdminContent>) => ('id' in item ? item.id : '');

  if (authLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
        </DialogHeader>
        {!user ? (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You must be signed in to view this page.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-6">
              <Select value={selectedTab} onValueChange={setSelectedTab}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a tab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trails">Trails</SelectItem>
                  <SelectItem value="peaks">Peaks</SelectItem>
                  <SelectItem value="stories">Stories</SelectItem>
                  <SelectItem value="expeditions">Expeditions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingItem ? (
              <Card>
                <CardHeader>
                  <CardTitle>{getId(editingItem) ? 'Edit Item' : 'New Item'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <Input
                        id="title"
                        value={getTitle(editingItem) || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, title: e.target.value, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        id="description"
                        value={getDescription(editingItem) || ''}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingItem({ ...editingItem, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                      <Input
                        id="image_url"
                        value={getImageUrl(editingItem) || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">Save</Button>
                      <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <>
                <Button onClick={handleNew} className="mb-4">Add New Item</Button>
                <Card>
                  <CardHeader>
                    <CardTitle>Content for {selectedTab}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contentLoading ? (
                      <p>Loading content...</p>
                    ) : (
                      <div className="space-y-4">
                        {content?.map((item) => (
                          <div key={getId(item)} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{getTitle(item)}</h3>
                              <p className="text-sm text-gray-500">{getDescription(item)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(getId(item) || '')}>Delete</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;