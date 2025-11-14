import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";

interface ProfilePageProps {
  userProfile: UserProfile;
  handleLogout: () => void;
}

export default function ProfilePage({
  userProfile,
  handleLogout,
}: ProfilePageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      <Card className="border-border">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold flex items-center justify-center h-full w-full">
                {userProfile.nombreUsuario.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {userProfile.nombreUsuario}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Usuario de BANRESERVAS
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                ID de Usuario
              </Label>
              <p className="text-base font-medium">{userProfile.idUsuario}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Nombre de Usuario
              </Label>
              <p className="text-base font-medium">
                {userProfile.nombreUsuario}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Correo Electrónico
              </Label>
              <p className="text-base font-medium">
                {userProfile.correoElectronico}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Fecha de Registro
              </Label>
              <p className="text-base font-medium">
                {formatDate(userProfile.fechaRegistro)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
