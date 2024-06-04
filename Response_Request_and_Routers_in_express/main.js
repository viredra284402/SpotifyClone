const express = require('express')
const blog = require('./routes/blog')
const shop = require('./routes/shop')




const app = express()
const port = 3000

app.use(express.static("public"))
app.use('/blog', blog)
app.use('/shop', shop)

app.get('/', (req, res) => {
  console.log("hay its a get request")
  res.send('Hello World!2525')
})
app.post('/', (req, res) => {
  console.log("hay its a post request")
  res.send('Hello World! post')
})
app.put('/', (req, res) => {
  console.log("hay its a put request")
  res.send('Hello World! put')
}).delete('/', (req, res) => {
  console.log("hay its a delete request")
  res.send('Hello World! delete')
})

app.get("/index", (req, res) => {
  console.log("hay its a index")
  res.sendFile('templates/index.html', {root: __dirname})
} )

app.get("/api", (req , res)=>{
  res.json({ a: "one" , b:"two" , c:"three", d:"four", name: ["virendra pal", "sahvendra pal"] })
})
app.get("/download", (req , res)=>{
  res.download({ a: "one" , b:"two" , c:"three", d:"four", name: ["virendra pal", "sahvendra pal"] })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
