import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/video'
    }
  ];
  //

  return (
    <>
       <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] font-sans">
       
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12 motion-safe:animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">
              Admin Panel
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage coding problems, user roles, and platform settings from one central place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {adminOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className="card group bg-white shadow-lg border border-gray-200/80 rounded-2xl hover:border-red-400/50 transition-all duration-300 motion-safe:hover:-translate-y-2 motion-safe:animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body items-center text-center p-8">
                    <div className="bg-gray-100 p-4 rounded-full mb-5 border border-gray-200/80 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-200">
                      <IconComponent size={32} className="text-gray-700 transition-colors duration-300" />
                    </div>

                    <h2 className="card-title text-xl mb-2 text-gray-900 ">
                      {option.title}
                    </h2>

                    <p className="text-gray-600 mb-6 flex-grow">
                      {option.description}
                    </p>

                    <div className="card-actions">
                      <NavLink
                        to={option.route}
                        className="btn btn-error bg-black hover:bg-gradient-to-r from-red-600 to-pink-300 border-0 text-white shadow-sm shadow-red-600/30 hover:scale-[1.03] active:scale-[0.99] transition-transform duration-200 ease-in-out"
                      >
                        {option.title}
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;