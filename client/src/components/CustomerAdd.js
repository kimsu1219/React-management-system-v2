import React from 'react'
import {post} from 'axios' // server와 통신

class CustomerAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday:'',
            gender: '',
            job: '',
            fileName: ''
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.addCustomer = this.addCustomer.bind(this)
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
            fileName: ''
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

    render() {
        return (
            // 양식전송함수실행되도록
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객 추가</h1>
                프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /><br/>
                이름: <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br/>
                생년월일: <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br/>
                성별: <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} /><br/>
                직업: <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange} /><br/>
                <button type="submit">추가하기</button>
            </form>



        )
    }
        
        
}

export default CustomerAdd;