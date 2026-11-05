import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Import modular routes
import authRoutes from './server/routes/authRoutes.js';
import projectRoutes from './server/routes/projectRoutes.js';
import agreementRoutes from './server/routes/agreementRoutes.js';
import milestoneRoutes from './server/routes/milestoneRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';
import messageRoutes from './server/routes/messageRoutes.js';
import integrationRoutes from './server/routes/integrationRoutes.js';
import aiRoutes from './server/routes/aiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount REST API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/ai', aiRoutes);

// Legacy routes preserved for existing frontend calls
app.post('/api/gemini/analyze-scope', (req: Request, res: Response, next) => {
  // Proxy to aiRoutes
  req.url = '/analyze-scope';
  aiRoutes(req, res, next);
});

app.post('/api/gemini/generate-agreement', (req: Request, res: Response) => {
  const {
    projectTitle = 'Corporate Website',
    clientName = 'Marcus Vance',
    freelancerName = 'Alex Rivera',
    budget = 200,
    timelineDays = 15,
    deliverables = ['5 pages', 'Contact form', 'Responsive design'],
    revisionLimit = 2,
  } = req.body;

  const content = `MASTER FREELANCE SERVICES AGREEMENT (SAMPLE DRAFT)
-----------------------------------------------------------------------------
DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
FREELANCER: ${freelancerName} ("Provider")
CLIENT: ${clientName} ("Client")
PROJECT: ${projectTitle}

1. SCOPE OF SERVICES & DELIVERABLES
Provider agrees to design, build, and deliver the following specific deliverables:
${(Array.isArray(deliverables) ? deliverables : [deliverables]).map((d: string, i: number) => `   1.${i + 1} ${d}`).join('\n')}

2. BUDGET, COMPENSATION & MILESTONES
Total Agreed Fixed Compensation: $${budget} USD.
Expected Delivery Timeline: ${timelineDays} business days from project commencement.
Payments shall be held in simulated milestone status and released as deliverables are approved.

3. REVISION POLICY & LIMITS
This agreement includes up to ${revisionLimit} rounds of reasonable design and layout revisions.

4. SCOPEGUARD™ SCOPE CREEP & CHANGE MANAGEMENT POLICY
Any new features, additional views, third-party integrations, or functional changes not explicitly itemized in Section 1 shall be submitted through TrustBridge ScopeGuard AI.

5. SAMPLE DOCUMENT NOTICE
DEMO ESCROW & AGREEMENT – No real money is transferred or held.`;

  return res.json({
    success: true,
    content,
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    app: 'TrustBridge AI',
    timestamp: new Date().toISOString(),
    sandboxEscrowMode: process.env.PAYMENT_MODE || 'sandbox',
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TrustBridge AI server running on http://localhost:${PORT}`);
  });
}

startServer();
