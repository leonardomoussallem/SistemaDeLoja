import { Router, Request, Response } from 'express';
import { 
  criarVenda, 
  listarProdutos, 
  relatorioVendas, 
  adicionarProduto, 
  excluirProduto,
  listarCategorias, 
  adicionarCategoria, 
  excluirCategoria,
  listarSubcategorias, 
  adicionarSubcategoria, 
  excluirSubcategoria,
  excluirVenda 
} from '../controllers/lojaController';

const router = Router();

router.post('/venda', (req: Request, res: Response) => criarVenda(req, res));
router.get('/produtos', (req: Request, res: Response) => listarProdutos(req, res));
router.get('/relatorio-vendas', (req: Request, res: Response) => relatorioVendas(req, res));
router.post('/produtos', (req: Request, res: Response) => adicionarProduto(req, res));
router.delete('/produtos/:id', (req: Request, res: Response) => excluirProduto(req, res));
router.get('/categorias', (req: Request, res: Response) => listarCategorias(req, res));
router.post('/categorias', (req: Request, res: Response) => adicionarCategoria(req, res));
router.delete('/categorias/:id', (req: Request, res: Response) => excluirCategoria(req, res));
router.get('/subcategorias', (req: Request, res: Response) => listarSubcategorias(req, res));
router.post('/subcategorias', (req: Request, res: Response) => adicionarSubcategoria(req, res));
router.delete('/subcategorias/:id', (req: Request, res: Response) => excluirSubcategoria(req, res));
router.delete('/vendas/:id', (req: Request, res: Response) => excluirVenda(req, res));

export default router;