import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "requesting" | "verifying">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const requestOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return setError("Укажите email");
    setError(null);
    setMessage(null);
    setStatus("requesting");
    try {
      await adminAuth.requestOtp(trimmedEmail);
      setMessage("Код отправлен на master email. Введите код и пароль для входа.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить код");
    } finally {
      setStatus("idle");
    }
  };

  const verifyOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !code.trim() || !password.trim()) {
      return setError("Укажите email, код и пароль");
    }
    setError(null);
    setMessage(null);
    setStatus("verifying");
    try {
      const res = await adminAuth.verifyOtp(trimmedEmail, code.trim(), password.trim());
      adminAuth.setToken(res.token);
      navigate("/admin/catalog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход для администратора</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Пароль</label>
            <Input
              type="password"
              placeholder="Пароль (мин. 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Код из письма</label>
            <Input
              placeholder="Например 123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {message && (
            <Alert className="border border-primary/30 bg-primary/5 text-primary">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={requestOtp} disabled={status !== "idle"}>
              {status === "requesting" ? "Отправляем..." : "Получить код"}
            </Button>
            <Button type="button" className="w-1/2" onClick={verifyOtp} disabled={status !== "idle"}>
              {status === "verifying" ? "Входим..." : "Войти"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

