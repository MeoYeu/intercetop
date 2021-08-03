import React, { useState,useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function App() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [users, setUser] = useState();
  const [ischeck, setischeck] = useState(false);
  const [check, setcheck] = useState({name:'lan'})
  const submithandle = async (e) => {
    e.preventDefault();
    try {
     
      const res = await axios
        .post("/user/login", { email, password })
        .then( (res) => {
          localStorage.setItem('firstLogin', true)               
          setUser(res.data);
        });
    } catch (error) {
      console.log("lỗi rồi",error.message);
    }
  };
  const freshToken = async () => {
    try {
      const res = await axios.get("/user/refreshtoken");
      setUser({
        ...users,
        accessToken: res.data.accesstoken,
        
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const axiosJwt=axios.create();
  axiosJwt.interceptors.request.use(async (config) => {
    // sau sẽ kiểm tra trạng thái báo về bằng bao nhiêu để biết cần gia hạn token
    let currentDate = new Date();
 
    const decodeToken = jwt_decode(users.accessToken);
    
    if(decodeToken.exp *  1000 < currentDate.getTime())
    {
      // console.log({alo:config.headers.authorization});     
      const data= await freshToken();
      config.headers.authorization="Bearer "+ data.accesstoken
      
    }return config;
  },(err)=>{
    return Promise.reject({
      msg:err.message
    })
  });
  const clickhandle = async (e) => {
    try {
    
      await axiosJwt
        .get("/user/infor", {
          headers: { authorization:"Bearer "+ users?.accessToken},
        })
        .then((n) => {
          // console.log(n)
        });
    } catch (error) {
      console.log("lỗi", error.message);
    }
  };

  return (
    <div className="App">
      {users ? (
        <div>
          <p>ok</p>
          <button onClick={clickhandle}>click</button>
        </div>
      ) : (
        <form style={{ margin: "20px" }}>
          <div className="form-group">
            <label>
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>
          <div className="form-group">
            <label >
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>

          <button type="submit" onClick={submithandle}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
