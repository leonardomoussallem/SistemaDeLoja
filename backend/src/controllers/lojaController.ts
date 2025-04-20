import { Request, Response } from 'express';
import pool from '../config/db';

export const criarVenda = async (req: Request, res: Response) => {
  const { produto_id, quantidade, forma_pagamento } = req.body;

  try {
    const produtoResult = await pool.query(
      'SELECT * FROM produtos WHERE id = $1',
      [produto_id]
    );
    const produto = produtoResult.rows[0];

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    if (produto.estoque < quantidade) {
      return res.status(400).json({ erro: 'Estoque insuficiente' });
    }

    const valor_total = parseFloat(produto.preco) * quantidade;
    const lucro = valor_total - (parseFloat(produto.custo) * quantidade);

    await pool.query(
      'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2',
      [quantidade, produto_id]
    );

    const vendaResult = await pool.query(
      'INSERT INTO vendas (produto_id, quantidade, forma_pagamento, valor_total, lucro) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [produto_id, quantidade, forma_pagamento, valor_total, lucro]
    );

    res.status(201).json({ mensagem: 'Venda realizada', venda: vendaResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao realizar a venda' });
  }
};

export const listarProdutos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome, s.nome AS subcategoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
    `);
    const produtos = result.rows.map((produto) => ({
      ...produto,
      preco: parseFloat(produto.preco),
      custo: parseFloat(produto.custo),
    }));
    res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

export const relatorioVendas = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT v.id, v.produto_id, p.nome AS produto_nome, v.quantidade, v.forma_pagamento, v.valor_total, v.lucro, v.data
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      ORDER BY v.data DESC
    `);
    const vendas = result.rows.map((venda) => ({
      ...venda,
      valor_total: parseFloat(venda.valor_total),
      lucro: parseFloat(venda.lucro),
    }));
    const totalLucro = vendas.reduce((sum, venda) => sum + venda.lucro, 0);
    res.status(200).json({ vendas, totalLucro });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao gerar relatório de vendas' });
  }
};

export const adicionarProduto = async (req: Request, res: Response) => {
  const { nome, preco, custo, estoque, categoria_id, subcategoria_id, estoque_minimo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, custo, estoque, categoria_id, subcategoria_id, estoque_minimo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nome, preco, custo, estoque, categoria_id, subcategoria_id, estoque_minimo]
    );
    const produto = {
      ...result.rows[0],
      preco: parseFloat(result.rows[0].preco),
      custo: parseFloat(result.rows[0].custo),
    };
    const categoriaResult = await pool.query('SELECT nome FROM categorias WHERE id = $1', [produto.categoria_id]);
    const subcategoriaResult = await pool.query('SELECT nome FROM subcategorias WHERE id = $1', [produto.subcategoria_id]);
    produto.categoria_nome = categoriaResult.rows[0]?.nome || '';
    produto.subcategoria_nome = subcategoriaResult.rows[0]?.nome || '';
    res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar produto' });
  }
};

export const excluirProduto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
};

export const listarCategorias = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
};

export const adicionarCategoria = async (req: Request, res: Response) => {
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar categoria' });
  }
};

export const excluirCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    res.status(200).json({ mensagem: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir categoria' });
  }
};

export const listarSubcategorias = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM subcategorias');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar subcategorias' });
  }
};

export const adicionarSubcategoria = async (req: Request, res: Response) => {
  const { nome, categoria_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO subcategorias (nome, categoria_id) VALUES ($1, $2) RETURNING *',
      [nome, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar subcategoria' });
  }
};

export const excluirSubcategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM subcategorias WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Subcategoria não encontrada' });
    }
    res.status(200).json({ mensagem: 'Subcategoria excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir subcategoria' });
  }
};

export const excluirVenda = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM vendas WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }
    const venda = result.rows[0];
    await pool.query(
      'UPDATE produtos SET estoque = estoque + $1 WHERE id = $2',
      [venda.quantidade, venda.produto_id]
    );
    res.status(200).json({ mensagem: 'Venda excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir venda' });
  }
};