import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from "./modules/pages/home";
import { ECRPage } from "./modules/pages/ecr";
import { ECRImagesPage } from "./modules/pages/ecr/images";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { NotificationsProvider } from "./modules/notifications/provider";
import { Toaster } from "@/components/ui/sonner"
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { WSProvider } from "./modules/ws/provider";
import { DynamicProvider } from "./modules/dynamic/provider";
import { ECRRegistersImage } from "./modules/pages/ecr/registers";

const queryClient = new QueryClient()

export default function App() {
  return (
    <div className='h-[100dvh] w-[100dvw] p-2 flex gap-2'>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <WSProvider />
        <NotificationsProvider />
        <DynamicProvider />
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <TooltipProvider>
            <BrowserRouter>
              <Card className='flex flex-col'>
                <CardHeader className='w-[350px]'>
                  <CardTitle>AWS2</CardTitle>
                </CardHeader>
                <CardContent className='flex-1 space-y-2'>
                  <div className='space-y-1'>
                    <Label className='fold-bold text-muted-foreground'>ECR</Label>
                    <Separator />
                    <div className='space-y-1'>
                      <Button asChild className='justify-start' variant='secondary'>
                        <Link to='/ecr/images'>
                          Imagens
                        </Link>
                      </Button>
                      <Button asChild className='justify-start' variant='secondary'>
                        <Link to='/ecr/registers'>
                          Registros
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>

                </CardFooter>
              </Card>
              <div className='flex-1 overflow-y-scroll p-2'>
                <Routes>
                  <Route
                    path='/'
                    element={<HomePage />}
                  />
                  <Route
                    path='/ecr'
                    element={<ECRPage />}
                  />
                  <Route
                    path='/ecr/images'
                    element={<ECRImagesPage />}
                  />
                  <Route
                    path='/ecr/registers'
                    element={<ECRRegistersImage />}
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  )
}