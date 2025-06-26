
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemList } from '@/components/crud/ItemList';
import { ItemForm } from '@/components/crud/ItemForm';
import { LogOut, Plus, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { user, signOut } = useAuth();

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowItemForm(true);
    setActiveTab('items');
  };

  const handleCloseForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {user?.email?.split('@')[0]}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'home'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>Items</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Your App</CardTitle>
                <CardDescription>
                  This is a modern CRUD application with real Supabase authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  You can now manage your items with secure authentication. Your data is stored in Supabase and protected with Row Level Security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => {
                    setActiveTab('items');
                    setShowItemForm(true);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
                <Button
                  onClick={() => setActiveTab('items')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  View All Items
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Email:</strong> {user?.email}</p>
                  <p className="text-sm"><strong>User ID:</strong> {user?.id?.slice(0, 8)}...</p>
                  <p className="text-sm"><strong>Status:</strong> <span className="text-green-600">Authenticated</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Items</h2>
              <Button
                onClick={() => setShowItemForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </Button>
            </div>

            {showItemForm ? (
              <ItemForm
                item={editingItem}
                onClose={handleCloseForm}
                onSave={handleCloseForm}
              />
            ) : (
              <ItemList onEdit={handleEditItem} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};
