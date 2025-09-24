import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StickyNote, Plus, Sparkles } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Sticky Note</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Organize Your Thoughts with
              <span className="bg-gradient-hero bg-clip-text text-transparent block">
                Digital Sticky Notes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create customizable boards and colorful sticky notes to keep your ideas, 
              tasks, and inspiration organized in one beautiful place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/create-board')}
              className="px-8 py-3 text-lg font-medium shadow-hover hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/boards')}
              className="px-8 py-3 text-lg font-medium"
            >
              View Boards
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-sticky-yellow p-6 rounded-lg shadow-sticky transform rotate-1 hover:rotate-0 transition-transform">
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <h3 className="font-bold text-gray-800 mb-2">Colorful Notes</h3>
                <p className="text-sm text-gray-700">Choose from vibrant colors to categorize your thoughts</p>
              </div>
            </div>
            
            <div className="bg-sticky-pink p-6 rounded-lg shadow-sticky transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-center">
                <StickyNote className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <h3 className="font-bold text-gray-800 mb-2">Multiple Boards</h3>
                <p className="text-sm text-gray-700">Organize projects with dedicated boards</p>
              </div>
            </div>
            
            <div className="bg-sticky-blue p-6 rounded-lg shadow-sticky transform rotate-1 hover:rotate-0 transition-transform">
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <h3 className="font-bold text-gray-800 mb-2">Easy Creation</h3>
                <p className="text-sm text-gray-700">Quickly add notes and to-do items</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Developed by <span className="font-semibold">Feranmi</span> (Fullstack, Backend Major), 
            <span className="font-semibold"> Christopher</span> (Fullstack), and supervised by 
            <span className="font-semibold"> H.E Sir Tochukwu</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;