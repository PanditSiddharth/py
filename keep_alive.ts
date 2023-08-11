const express = require('express');
import config from "./config";
const keep_alive = (obj:any = {}) =>{
const app = express();

let h = {
  sleep: async function(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
  
const port = 3000;
app.get('/', (req: any, res: any)=>{
   res.status(200).send("bot running..")
//    res.sendStatus(200)
})

app.use(express.json());
// Endpoint to accept an object
app.post('/obj', (req:any, res:any) => {
  try {

  const r = req.body;
  // console.log('Received object:', r);
 obj["" + r.id + ""] = {
   text: r.text,
    }

  h.sleep(config.ttl * 500)
  .then(()=> {delete obj["" + r.id]})
    
  // Perform any required operations with the received object

  res.status(200).json({ message: 'Object received successfully' });
        
  } catch (error: any) {
  res.status(200).json({ message: 'Some error' });
  }
});
  
app.listen(port, () => console.log(`Bot running on http://localhost:${port}`));
}
export default keep_alive