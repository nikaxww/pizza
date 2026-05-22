import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connection } from './connectDB.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.get('/api/partners', (req, res) => {
  connection.query("SELECT * FROM partners", (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка загрузки партнёров' })
    }
    res.json(results)
  })
})

app.get('/api/partners/:id', (req, res) => {
  connection.query("SELECT * FROM partners WHERE id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка поиска партнёра' })
    }
    res.json(results[0])
  })
})

app.get('/api/partners/search/:q', (req, res) => {
  const query = `%${req.params.q}%`
  connection.query(
    "SELECT * FROM partners WHERE name LIKE ? OR kitchen LIKE ?",
    [query, query],
    (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ошибка поиска' })
      }
      res.json(results)
    }
  )
})

app.get('/api/products/partner/:id', (req, res) => {
  connection.query("SELECT * FROM products WHERE id_partners = ?", [req.params.id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка загрузки товаров' })
    }
    res.json(results)
  })
})


// Регистрация
app.post('/api/users/register', (req, res) => {
  const { full_name, email, phone, address, password, login } = req.body
  const values = [full_name, email, phone, address, password, login]
  const sql = "INSERT INTO users (full_name, email, phone, address, password, login) VALUES (?, ?, ?, ?, ?, ?)"
  
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Такой логин уже занят' })
      }
      return res.status(500).json({ error: 'Ошибка при регистрации' })
    }
    console.log('Регистрация успешна')
    res.status(201).json({ id: results.insertId, message: 'Регистрация успешна' })
  })
})

// Вход
app.post('/api/users/login', (req, res) => {
  const { login, password } = req.body
  const sql = "SELECT * FROM users WHERE login = ? AND password = ?"
  
  connection.query(sql, [login, password], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка сервера' })
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }
    const user = results[0]
    res.json({
      user: {
        id: user.id,
        login: user.login,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    })
  })
})

// Получить пользователя по ID
app.get('/api/users/:id', (req, res) => {
  connection.query(
    "SELECT id, full_name, email, phone, address, login FROM users WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ошибка поиска пользователя' })
      }
      res.json(results[0])
    }
  )
})

app.get('/api/basket/:userId', (req, res) => {
  const sql = `
    SELECT bi.*, p.name, p.price, p.image FROM basket_item bi
    JOIN products p ON bi.id_product = p.id WHERE bi.id_user = ?
  `
  connection.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка загрузки корзины' })
    }
    res.json(results)
  })
})

app.post('/api/basket', (req, res) => {
  const { id_user, id_product, quantity } = req.body
  
  connection.query(
    "SELECT * FROM basket_item WHERE id_user = ? AND id_product = ?",
    [id_user, id_product],
    (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ошибка проверки корзины' })
      }
      
      if (results.length > 0) {
        connection.query(
          "UPDATE basket_item SET quantity = quantity + ? WHERE id_user = ? AND id_product = ?",
          [quantity, id_user, id_product],
          (err) => {
            if (err) {
              console.log(err)
              return res.status(500).json({ error: 'Ошибка обновления корзины' })
            }
            res.json({ ok: true })
          }
        )
      } else {
        connection.query(
          "INSERT INTO basket_item (id_user, id_product, quantity) VALUES (?, ?, ?)",
          [id_user, id_product, quantity],
          (err) => {
            if (err) {
              console.log(err)
              return res.status(500).json({ error: 'Ошибка добавления в корзину' })
            }
            res.json({ ok: true })
          }
        )
      }
    }
  )
})

app.put('/api/basket/:id', (req, res) => {
  connection.query(
    "UPDATE basket_item SET quantity = ? WHERE id = ?",
    [req.body.quantity, req.params.id],
    (err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ошибка обновления количества' })
      }
      res.json({ ok: true })
    }
  )
})

app.delete('/api/basket/:id', (req, res) => {
  connection.query("DELETE FROM basket_item WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка удаления из корзины' })
    }
    res.json({ ok: true })
  })
})

app.delete('/api/basket/user/:userId', (req, res) => {
  connection.query("DELETE FROM basket_item WHERE id_user = ?", [req.params.userId], (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка очистки корзины' })
    }
    res.json({ ok: true })
  })
})

app.post('/api/orders', (req, res) => {
  const { id_user, delivery_address, payment_method, items } = req.body
  
  connection.query(
    "INSERT INTO orders (id_user, delivery_address, payment_method) VALUES (?, ?, ?)",
    [id_user, delivery_address, payment_method],
    (err, orderResult) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Ошибка создания заказа' })
      }
      
      const orderId = orderResult.insertId
      let completed = 0
      
      if (!items || items.length === 0) {
        return res.json({ orderId, message: 'Заказ создан' })
      }
      
      items.forEach(item => {
        connection.query(
          "INSERT INTO order_items (id_order, id_product, price_at_order, quantity) VALUES (?, ?, ?, ?)",
          [orderId, item.id_product, item.price, item.quantity],
          (err) => {
            if (err) console.log("Order item error:", err)
            completed++
            if (completed === items.length) {
              connection.query("DELETE FROM basket_item WHERE id_user = ?", [id_user], () => {
                res.json({ orderId, message: 'Заказ создан' })
              })
            }
          }
        )
      })
    }
  )
})

app.get('/api/orders/user/:userId', (req, res) => {
  const sql = `
    SELECT o.*, GROUP_CONCAT(CONCAT(p.name, ':', oi.quantity)) as items
    FROM orders o 
    LEFT JOIN order_items oi ON o.id = oi.id_order
    LEFT JOIN products p ON oi.id_product = p.id
    WHERE o.id_user = ? 
    GROUP BY o.id 
    ORDER BY o.created_at DESC
  `
  
  connection.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Ошибка загрузки заказов' })
    }
    res.json(results)
  })
})


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(3000, () => {
  console.log('web server listening on port 3000')
})