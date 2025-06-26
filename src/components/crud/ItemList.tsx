
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface Item {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface ItemListProps {
  onEdit: (item: Item) => void;
}

export const ItemList = ({ onEdit }: ItemListProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Add some sample data
      const sampleItems: Item[] = [
        {
          id: '1',
          title: 'Sample Task 1',
          description: 'This is a sample task to demonstrate the CRUD functionality',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Sample Task 2',
          description: 'Another sample task with pending status',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];
      setItems(sampleItems);
      localStorage.setItem('items', JSON.stringify(sampleItems));
    }
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    toast({
      title: "Item deleted",
      description: "The item has been successfully deleted.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No items found. Click the "Add Item" button to create your first item.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <Badge className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <p className="text-xs text-gray-400 mb-4">
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
