import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, User as UserIcon, Lock, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal = ({ isOpen, onClose }: UserSettingsModalProps) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preencher dados do usuário ao abrir o modal
  useEffect(() => {
    if (user && isOpen) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
      });
    }
  }, [user, isOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
      });

      toast.success("Perfil atualizado com sucesso! ✅");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres!");
      return;
    }

    setIsLoading(true);

    try {
      // Aqui você implementaria a lógica de mudança de senha
      // Por enquanto, só mostramos uma mensagem
      toast.info("Funcionalidade de alteração de senha em desenvolvimento");
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
      toast.info("Funcionalidade de exclusão de conta em desenvolvimento");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Configurações da Conta
          </DialogTitle>
          <DialogDescription>
            Gerencie suas informações pessoais e preferências
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          {/* Aba de Perfil */}
          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Nome Completo</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profile-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 bg-muted"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    O email não pode ser alterado
                  </p>
                </div>

                <div>
                  <Label htmlFor="profile-phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profile-address">Endereço Padrão</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="profile-address"
                      placeholder="Rua, número, complemento, bairro, cidade - CEP"
                      className="pl-10 min-h-[80px]"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este endereço será usado por padrão no checkout
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Aba de Segurança */}
          <TabsContent value="security" className="space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Digite sua senha atual"
                      className="pl-10"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repita a nova senha"
                      className="pl-10"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </DialogFooter>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações irreversíveis que afetam sua conta
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  type="button"
                >
                  Excluir Conta
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Aba de Preferências */}
          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Notificações</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Email de Marketing</p>
                    <p className="text-xs text-muted-foreground">
                      Receba ofertas e novidades por email
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Em breve
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Notificações de Pedido</p>
                    <p className="text-xs text-muted-foreground">
                      Atualizações sobre status dos seus pedidos
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Em breve
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Aparência</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Tema Escuro</p>
                    <p className="text-xs text-muted-foreground">
                      Ativar modo escuro na interface
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Em breve
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Privacidade</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Compartilhar Dados</p>
                    <p className="text-xs text-muted-foreground">
                      Permitir uso de dados para melhorias
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Em breve
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;