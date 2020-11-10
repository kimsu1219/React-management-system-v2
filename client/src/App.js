import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

import Customer from './components/Customer'
import CustomerTable from './components/CustomerTable'
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import classes from '*.module.css';

const styles = theme => ({
  root: {
    width: "100%",
    // marginTop: theme.spacing.unit * 3,
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  },
  progress: {
    // margin: theme.spacing.unit * 2
    margin: theme.spacing(2)
  }
});

class App extends Component {
  // ?prop와 달리 변경될 수 있는 데이터를 담는 state?
  state = {
    customers: '',
    completed: 0
  }
    
  componentDidMount() {
    this.timer = setInterval(this.progress, 20); //progress함수를 계속실행시킬 timer
    this.callApi()
      .then(res => this.setState({customers: res})) //customer 목록데이터를 받아서 state로 설정, customers라는 변수 값에 body내용 담김
      .catch(err => console.log(err));
  }
  
  componentWillMount() {
    clearInterval(this.timer);
  }
    
  callApi = async () => {
      const response = await fetch('/api/customers'); 
      const body = await response.json(); //custom 목록 json형태
      return body;
  }
  progress = () => { //circularprogress애니메이션을 위한 함수
    const {completed} = this.state;
    this.setState({completed: completed >= 100 ? 0 : completed + 1});
  }

    
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.state.customers ? this.state.customers.map(c => {
              // console.log(c)
              return <CustomerTable key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
            }) : ""}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

// const customers = [
//   {
//   'id': 1,
//   'image': 'https://placeimg.com/64/64/1',
//   'name': '홍길동',
//   'birthday': '961222',
//   'gender': '남자',
//   'job': '대학생'
//   },
//   {
//   'id': 2,
//   'image': 'https://placeimg.com/64/64/2',
//   'name': '홍홍홍',
//   'birthday': '961202',
//   'gender': '남자',
//   'job': '프로그래머'
//   },
//   {
//   'id': 3,
//   'image': 'https://placeimg.com/64/64/3y',
//   'name': '길길길',
//   'birthday': '961122',
//   'gender': '남자',
//   'job': '대학생'
//   },

// ]

//?function, class 차이?
// function App(props) {
//   // console.log(props)
//   const {classes} = props; // ?classes사용법?
//   return (
//     <div>
//     {/* <Paper>
//       <Table> */}
//     <Paper className={classes.root}>
//       <Table className={classes.table}>
//         <TableHead>
//           <TableRow>
//             <TableCell>번호</TableCell>
//             <TableCell>이미지</TableCell>
//             <TableCell>이름</TableCell>
//             <TableCell>생년월일</TableCell>
//             <TableCell>성별</TableCell>
//             <TableCell>직업</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//          {customers.map(c => {
//             return <CustomerTable key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
//           })}
//         </TableBody>
//       </Table>
      
//     </Paper>
//     </div>

//     // <div>
//     //   {customers.map(c => {
//     //     console.log(c)
//     //     return <Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />

//     //   })}

//     // </div>
//     // <div>
//     // <Customer
//     // id={customers[0].id}
//     // image={customers[0].image}
//     // name={customers[0].name}
//     // birthday={customers[0].birthday}
//     // gender={customers[0].gender}
//     // job={customers[0].job}
//     // />
//     // <Customer
//     // id={customers[1].id}
//     // image={customers[1].image}
//     // name={customers[1].name}
//     // birthday={customers[1].birthday}
//     // gender={customers[1].gender}
//     // job={customers[1].job}
//     // />
//     // <Customer
//     // id={customers[2].id}
//     // image={customers[2].image}
//     // name={customers[2].name}
//     // birthday={customers[2].birthday}
//     // gender={customers[2].gender}
//     // job={customers[2].job}
//     // />
//     // </div>
    
    
//     // <Customer
//     //   id = {customer.id}
//     //   image = {customer.image}
//     //   name = {customer.name}
//     //   birthday = {customer.birthday}
//     //   gender={customer.gender}
//     //   job={customer.job}
//     //     />

//     // <div className="gray-background">
//     //   <img src={logo} alt="logo"/> 
//     //   {/* logo 변수 -> {}에 담아야함  */}
//     //   <h2>Let's develop management system!</h2>
//     // </div>

//     // <div className="App">
//     //   <header className="App-header">
//     //     <img src={logo} className="App-logo" alt="logo" />
//     //     <p>
//     //       Edit <code>src/App.js</code> and save to reload.
//     //     </p>
//     //     <a
//     //       className="App-link"
//     //       href="https://reactjs.org"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       Learn React
//     //     </a>
//     //     <p>LET's develop management system</p>
//     //   </header>
//     // </div>


//   );
// }

// export default App;
export default withStyles(styles)(App);
