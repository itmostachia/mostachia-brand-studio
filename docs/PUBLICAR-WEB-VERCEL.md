# Publicar webs con Vercel — setup de una vez

> Para humanos no técnicos **y** para el agente. Si sos el agente: hacé vos todo lo que sea comando;
> pedile a la persona solo lo que exige su navegador o su mail (crear cuenta, aceptar invitación, login).

## Una sola vez por persona

1. **Cuenta:** crear cuenta propia en https://vercel.com/signup (plan Hobby, gratis). Cada uno publica
   desde su propia cuenta; no hace falta ningún team.
2. (Opcional) Si más adelante se usa un team compartido, alguien del team invita el mail y se acepta desde el mail.
3. **Node.js:** si `node -v` no responde, instalar la versión LTS desde https://nodejs.org.
4. **Vercel CLI:** `npm i -g vercel` y comprobar con `vercel --version`.
5. **Login:** `vercel login` → elegir "Continue with Email" (o el método con el que se creó la cuenta) →
   confirmar el link que llega al mail.
6. **Verificar:** `vercel whoami` muestra el usuario.

## Cada vez que se publica una web

Desde la carpeta de la web:

```bash
vercel deploy --prod --yes
```

- La primera vez pregunta nombre del proyecto: usar el slug de la marca. Queda linkeado (`.vercel/`).
- Devuelve la URL pública. Probarla en el celu y en la compu antes de mandarla.
- Para una versión de prueba (no pública): `vercel deploy --yes` (sin `--prod`).
- Dominio propio: Vercel → proyecto → Settings → Domains → agregar y seguir las instrucciones de DNS.

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| `vercel` no se reconoce | cerrar y abrir la terminal; si sigue, reinstalar con `npm i -g vercel` |
| "No existing credentials" | `vercel login` otra vez |
| Se cortó la conexión a mitad del deploy | no reintentar a ciegas: `vercel ls` y ver si el deploy igual quedó listo |
| Error de build | pasarle el error al agente: "arreglá el build y volvé a publicar" |
