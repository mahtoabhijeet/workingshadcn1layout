"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createSupabaseClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePanelContent } from '@/hooks/useSupabase';

type PanelContent = Database['public']['Tables']['panel_content']['Row'];

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('trails');
  const { data: content, loading: contentLoading, refetch } = usePanelContent(selectedTab);
  const [editingItem, setEditingItem] = useState<PanelContent | null>(null);
  const supabase = createSupabaseClient();

  const handleEdit = (item: PanelContent) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('panel_content').delete().eq('id', id);
      if (error) {
        alert('Error deleting item: ' + error.message);
      } else {
        refetch();
      }
    }
  };

  const handleNew = () => {
    setEditingItem({
      id: '',
      tab_name: selectedTab,
      title: '',
      description: '',
      image_url: '',
      content: {},
      created_at: '',
      updated_at: '',
    } as PanelContent);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !editingItem) return;

    const { id, created_at, updated_at, ...upsertData } = editingItem;

    const { error } = await supabase.from('panel_content').upsert(upsertData);

    if (error) {
      alert('Error saving item: ' + error.message);
    } else {
      setEditingItem(null);
      refetch();
    }
  };

  if (authLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="mb-6">
        <Select value={selectedTab} onValueChange={setSelectedTab}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a tab" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trails">Trails</SelectItem>
            <SelectItem value="peaks">Peaks</SelectItem>
            <SelectItem value="resources">Resources</SelectItem>
            <SelectItem value="people">People</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {editingItem ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem.id ? 'Edit Item' : 'New Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  id="description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                <Input
                  id="image_url"
                  value={editingItem.image_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (JSON)</label>
                <Textarea
                  id="content"
                  rows={5}
                  value={JSON.stringify(editingItem.content, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditingItem({ ...editingItem, content: parsed });
                    } catch (error) {
                      // Handle invalid JSON
                    }
                  }}
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
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
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
  );
};

export default AdminPage;