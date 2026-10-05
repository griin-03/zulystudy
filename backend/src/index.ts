import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono! Camlo Backend is running.')
})

// API nhận dữ liệu giờ học từ con Bot
app.post('/study-session', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, durationSeconds } = body

    if (!userId || !durationSeconds) {
      return c.json({ error: 'Missing userId or durationSeconds' }, 400)
    }

    // Tạm thời log ra, ở bước sau chúng ta sẽ lưu vào TiDB hoặc D1
    console.log(`[API Nhận dữ liệu] User ${userId} vừa học xong: ${durationSeconds} giây`)

    return c.json({ success: true, message: 'Đã lưu giờ học thành công!' })
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }
})

export default app
