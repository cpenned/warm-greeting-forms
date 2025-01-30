import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Home } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationMenu className="py-4">
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link to="/" className="flex items-center gap-2 hover:text-primary">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};