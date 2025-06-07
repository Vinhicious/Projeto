const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || '12345';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Usuário ou senha incorretos' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProdutos = async (req, res) => {
  try {
    const [produtos] = await db.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduto = async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
      [nome, descricao, preco, estoque]
    );
    res.status(201).json({ id: result.insertId, nome, descricao, preco, estoque });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque } = req.body;
  try {
    await db.query(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ? WHERE id = ?',
      [nome, descricao, preco, estoque, id]
    );
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM produtos WHERE id = ?', [id]);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
