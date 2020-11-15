import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Customer from './components/Customer'
import CustomerTable from './components/CustomerTable'
import CustomerAdd from './components/CustomerAdd';

import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';
// import classes from '*.module.css';



const styles = theme => ({
  root: {
    width: "100%",
    minWidth: 1080
    // marginTop: theme.spacing.unit * 3,
    // marginTop: theme.spacing(3),
    // overflowX: "auto"
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  table: {
    minWidth: 1080
  },
  progress: {
    // margin: theme.spacing.unit * 2
    margin: theme.spacing(2)
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
      width: 200,
      },
    },
  }
});

class App extends Component {

  // ?prop와 달리 변경될 수 있는 데이터를 담는 state?
  // state = {
  //   customers: '',
  //   completed: 0
  // }

  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword:''
    }
    this.stateRefresh = this.stateRefresh.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  // 검색하기 값 입력 변화 감지
  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }
  //사용자가 추가 삭제되었을때 state 초기화 함수
  stateRefresh() { 
    this.setState({
      customers: '',
      completed: 0,
      searchKeyword:'' // 검색창도 초기화
    });
    this.callApi() //이후고객목록을 새로 불러오도록
      .then(res => this.setState({customers: res})) //customer 목록데이터를 받아서 state로 설정, customers라는 변수 값에 body내용 담김
      .catch(err => console.log(err));
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
    // 고객정보를 출력하는 하는 부분
    //검색한 결과(filtered된 결과)만 출력되도록
    const filteredComponents = (data) => {
      //사용자가 입력한 searchkeyword가 포함되어있는 data만 남김
      data = data.filter((c) => {
      return c.name.indexOf(this.state.searchKeyword) > -1;
    });
    //출력
    return data.map((c) => {
      return <CustomerTable stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
      });
    }
    const { classes } = this.props;
    //tablerow 속성 배열로
    const cellList = ["번호", "프로필 이미지", "이름", "생년월일", "성별", "직업", "설정"]

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          고객 관리 시스템
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
              }}
              name="searchKeyword"
              value={this.state.searchKeyword}
              onChange={this.handleValueChange}
            />
          </div>
        </Toolbar>
      </AppBar>

      {/* 사용자 추가 button */}
      <div className={classes.menu}>
        <CustomerAdd stateRefresh={this.stateRefresh} />
      </div>

      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
            {cellList.map(c => {
              return <TableCell className={classes.tableHead}>{c}</TableCell>
            })}
              {/* <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
              <TableCell>설정</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
          {this.state.customers ?

            filteredComponents(this.state.customers) :
            <TableRow>
              <TableCell colSpan="6" align="center">
                <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
              </TableCell>
            </TableRow>
           }


          {/* {this.state.customers ? this.state.customers.map(c => {
              // console.log(c)
              //삭제이후에 staterefrsh가 수행될 수 있도록 
              return <CustomerTable stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
            }) : 
            <TableRow>
              <TableCell colSpan='6' align='center'>
                <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
              </TableCell>
            </TableRow>
          } */}
          </TableBody>
        </Table>
      </Paper>
        {/* cutomeradd 출력시 props값으로 staterefresh를 설정, 함수자체를 props형태로 보내줌 */}
        {/* <CustomerAdd stateRefresh={this.stateRefresh}/>  */}
      </div>
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