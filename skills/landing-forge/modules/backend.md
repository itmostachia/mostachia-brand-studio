# forge:backend — Form Capture Pipeline (n8n + Supabase)

This module is loaded by the Forge orchestrator. Do not invoke directly.
Reads: client-brief.md §3 (Backend)

---

## Phase 2 — Foundation [forge:backend]

### 2.1 Create Supabase table
Using Supabase MCP (`mcp__supabase__apply_migration`):

Read client-brief.md §3 "Form fields" and generate migration:

```sql
CREATE TABLE IF NOT EXISTS {table_name} (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- campos del client-brief §3
  name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT,
  company TEXT,
  message TEXT,
  -- campos adicionales segun brief
  source TEXT DEFAULT 'web_form',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  email_sent BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_{table_name}_created_at ON {table_name}(created_at DESC);
```

- Table name from client-brief §3 (default: `leads`)
- Field types: name/message → TEXT, email → TEXT + CHECK, phone → TEXT
- Always add UTM columns for marketing attribution
- Always add source column to identify origin

### 2.2 Create n8n webhook workflow
Using n8n MCP (`mcp__n8n-mcp__n8n_create_workflow`):

Create minimal workflow:
```
Webhook (POST) → Code (validate) → Supabase INSERT → [Notify] → Respond to Webhook
```

**Webhook node:**
- Method: POST
- Path: `{project_name}-form`
- Response mode: "Last Node"

**Code node (validate):**
- Check required fields (name, email) are present and non-empty
- Validate email format with regex
- Check honeypot field is empty (spam rejection)
- Extract UTM params from request body
- Return validated data or throw error

**Supabase node:**
- Operation: INSERT
- Table: from 2.1
- Map validated fields to columns

**Notification node (conditional, based on client-brief §3):**
- email → Send Email node (SMTP or SendGrid)
- whatsapp → HTTP Request to WhatsApp Business API
- telegram → Telegram node
- slack → Slack node
- Content: "Nuevo lead: {name} ({email}) — {message}"

**Respond to Webhook:**
- Success: `{ "success": true, "message": "Gracias por contactarnos" }`
- Error: `{ "success": false, "message": "Error al enviar, intenta de nuevo" }`

**IMPORTANTE:** Dejar workflow INACTIVE hasta que pase QA.
Guardar `webhook_url` para Phase 3.

### 2.3 Verify credentials
- Verify Supabase credential exists in n8n: `mcp__n8n-mcp__n8n_manage_credentials`
- Verify notification credentials (email SMTP, Telegram bot token, etc.)
- If missing, reportar al usuario qué credencial falta

---

## Phase 3 — Build [forge:backend]

### 3.1 Build form component
Create `src/components/sections/contact-form.tsx`:

**Form fields:** Derivados de client-brief §3
- Mapear cada campo a input/textarea con tipo correcto
- Labels accesibles con htmlFor
- Validación client-side (required, email pattern, phone pattern)

**States:**
- `idle` — formulario vacío, listo para llenar
- `loading` — spinner, botón disabled
- `success` — mensaje de agradecimiento, formulario oculto
- `error` — mensaje de error con botón de retry

**Features:**
- Honeypot field (`<input name="website" className="hidden" tabIndex={-1}>`)
- UTM capture: leer `window.location.search` y enviar utm_source/medium/campaign
- POST a `webhook_url` de Phase 2.2 via fetch
- Animado con Motion (Framer Motion): fade-in de campos, scale del botón
- Styled con colores de marca (globals.css variables)
- Accessible: aria-describedby para errores, focus management post-submit

### 3.2 Integrate into page
- Import ContactForm en `page.tsx` en la posición correspondiente del plan de secciones
- Si la sección "Contacto" ya existe en el plan → REEMPLAZAR con esta versión con backend
- Conectar CTAs de otras secciones para scroll suave al formulario

---

## Phase 4 — QA [forge:backend]

### 4.1 End-to-end test
Using Playwright:
1. Navegar al dev server → scroll al formulario
2. Llenar con datos de test: `{ name: "Test User", email: "test@example.com", message: "Test" }`
3. Submit
4. Verificar que aparece estado `success`
5. Verificar Supabase row: `mcp__supabase__execute_sql("SELECT * FROM {table} ORDER BY created_at DESC LIMIT 1")`
6. Verificar que la row tiene los datos correctos
7. Verificar notificación: `mcp__n8n-mcp__n8n_executions` — última ejecución exitosa

### 4.2 Test validation
- Submit vacío → verificar estados de error en campos required
- Email inválido → verificar rechazo
- Honeypot lleno → verificar que NO se guarda en Supabase (spam blocked)

### 4.3 Activate workflow
Después de que TODOS los tests pasen:
- Activar workflow: `mcp__n8n-mcp__n8n_update_partial_workflow` con `active: true`
- Verificar que webhook responde a POST real

### 4.4 Clean test data
```sql
DELETE FROM {table} WHERE email = 'test@example.com';
```

---

## Skills and MCPs used
- `mcp__supabase__apply_migration` — crear tabla
- `mcp__supabase__execute_sql` — verificar datos, limpiar tests
- `mcp__n8n-mcp__n8n_create_workflow` — crear workflow
- `mcp__n8n-mcp__n8n_update_partial_workflow` — activar/desactivar
- `mcp__n8n-mcp__n8n_executions` — verificar ejecuciones
- Si el equipo tiene un workflow template propio, importarlo por la API de n8n en vez de crearlo de cero
- Playwright — E2E testing

## Anti-conflict rules
- Form component sigue el MISMO design system que el resto de la landing (arquetipo, colores, sombras)
- Los campos se definen UNA VEZ en client-brief.md §3 — tabla Supabase y componente React derivan de ahí
- Webhook URL se crea en Phase 2 y se consume en Phase 3 — no hay dependencia circular
- El workflow n8n se deja INACTIVO hasta que QA confirme que todo funciona
- La notificación es OPCIONAL — si no hay canal configurado, solo guarda en Supabase
