import React from 'react'
import {post} from 'axios' // server와 통신

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    hidden: {
        display: 'none'
    }
});


class CustomerAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday:'',
            gender: '',
            job: '',
            fileName: '',
            open: false //dial창이열려있는지 확인
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.addCustomer = this.addCustomer.bind(this)

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleFormSubmit(e) {
        e.preventDefault()
        this.addCustomer()
        .then((res) => {
            console.log(res.data)
            this.props.stateRefresh(); //고객데이터 추가 이후에 불러와야됨
        })
        this.setState({ //데이터 전송 이후 고객추가양식비우기
            file: null,
            userName: '',
            birthday:'',
            gender: '',
            job: '',
            fileName: '',
            open: false
        })
        // window.location.reload();//새로고침
    }

    handleFileChange(e) {
        this.setState({
            file: e.target.files[0], //e.target=> 이벤트 발생한 input값, file중에서 첫번째 파일만
            fileName: e.target.value
        })
    }

    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);//현재 state 갱신
    }
    
    //api주소로 데이터 전송
    addCustomer() {
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file)
        formData.append('name', this.state.userName)
        formData.append('birthday', this.state.birthday)
        formData.append('gender', this.state.gender)
        formData.append('job', this.state.job)

        //표준에 맞는 헤더 추가해줘야됨, 데이터에 파일포함되있을때 설정
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config)
    } 


    handleClickOpen = () => {
        this.setState({
        open: true
        });    
    }

    handleClose = () => {
        this.setState({
        file: null,
        userName: '',
        birthday: '',
        gender: '',
        job: '',
        fileName: '',
        open: false
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>고객추가하기</Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>고객 추가</DialogTitle>
                    <DialogContent>
                        {/*hidden:입력값보이지 않게, accept:사용자가 iamge파일만 넣을 수 있도록, */}
                        <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} />
                        
                        {/* label태그 사용해서 사용자에게 보여지는 디자인작업 수행*/}
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === ''? "프로필 이미지 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <br/>
                        <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br/>
                        <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br/>
                        <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} /><br/>
                        <TextField label="직업" type="text" name="job" value={this.state.job} onChange={this.handleValueChange} /><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>


            // 양식전송함수실행되도록
            // <form onSubmit={this.handleFormSubmit}>
            //     <h1>고객 추가</h1>
            //     프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /><br/>
            //     이름: <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br/>
            //     생년월일: <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br/>
            //     성별: <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} /><br/>
            //     직업: <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange} /><br/>
            //     <button type="submit">추가하기</button>
            // </form>



        )
    }
        
        
}

// export default CustomerAdd;
export default withStyles(styles)(CustomerAdd)
