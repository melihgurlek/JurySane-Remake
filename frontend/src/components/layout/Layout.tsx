import { ReactNode } from 'react';
// Assuming Header and Footer components exist
// import Header from './Header'; 
// import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Assuming your app has a global header. If not, this can be removed. */}
      {/* <Header className="flex-shrink-0" /> */}

      {/* CHANGE: This main area now becomes a flex container that can properly manage its children */}
      <main className="flex-1 flex flex-col overflow-auto">
        {children}
      </main>

      {/* The footer is told not to shrink */}
      {/* <Footer className="flex-shrink-0" /> */}
    </div>
  );
};

export default Layout;