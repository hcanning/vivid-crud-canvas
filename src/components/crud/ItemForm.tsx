
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'];

interface ItemFormProps {
  item?: Item | null;
  onClose: () => void;
  onSave: (item: Item) => void;
}

export const ItemForm = ({ item, onClose, onSave }: ItemFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setStatus(item.status as 'active' | 'inactive' | 'pending');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save items.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (item) {
        // Update existing item
        const { data, error } = await supabase
          .from('items')
          .update({
            title,
            description,
            status,
          })
          .eq('id', item.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating item:', error);
          toast({
            title: "Error",
            description: "Failed to update item.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Item updated",
            description: "The item has been successfully updated.",
          });
          onSave(data);
        }
      } else {
        // Create new item
        const { data, error } = await supabase
          .from('items')
          .insert({
            title,
            description,
            status,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating item:', error);
          toast({
            title: "Error",
            description: "Failed to create item.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Item created",
            description: "The item has been successfully created.",
          });
          onSave(data);
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: "Failed to save item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item ? 'Edit Item' : 'Create New Item'}</CardTitle>
            <CardDescription>
              {item ? 'Update the item details below' : 'Fill in the details to create a new item'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
