import PageHeader from '@/components/admin/PageHeader';
import { categories, type Category } from '@/lib/mock';
import StatusPill from '@/components/admin/StatusPill';
import { MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage wedding service categories"
      >
        <button className="px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
          Add Category
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-wv.card rounded-xl p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-wv.lime rounded-lg flex items-center justify-center">
                <span className="text-wv.black font-bold text-lg">{category.name[0]}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-wv.line rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-wv.line rounded-lg">
                  <Eye size={16} />
                </button>
                {!category.isHidden && (
                  <button className="p-2 hover:bg-wv.line rounded-lg text-wv.danger">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="font-semibold text-wv.text mb-2">{category.name}</h3>
            <p className="text-sm text-wv.sub mb-4">{category.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-wv.sub">
                {category.activeVendors} active vendors
              </span>
              <StatusPill status={category.isHidden ? 'Suspended' : 'Active'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
