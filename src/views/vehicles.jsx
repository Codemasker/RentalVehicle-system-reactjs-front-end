import React from 'react';
import { Pane, Button, Text, Heading,SideSheet,Card,Paragraph,TextInputField,FormField,toaster,SearchInput,Select } from 'evergreen-ui';
import Car from '../attr/car.png';
import Bike from '../attr/bike.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import moment from 'moment';

class vehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleList :[],
            show:false,
            customerName:"",
            customerNameError:null,
            customerNumber:"",
            customerNumberError:null,
            pickUpDate:"",
            pickUpdDateError:null,
            dropOffDate:"",
            dropOffDateError:null,
            selectVehicle:null,
            vehicleAvailable:false,
            errorBook:"",
            search:"",
            filterVehicleType:""
        }
        this.ItemRow = this.ItemRow.bind(this);
        this.BookBox = this.BookBox.bind(this);
        this.ConfirmBook = this.ConfirmBook.bind(this);
        // this.pickUpDate = this.pickUpDate.bind(this);
        // this.dropOffDate = this.dropOffDate.bind(this);
    }

    componentDidMount(){
        fetch("http://localhost:8080/vehicle/",{
                method:"GET"
            }).then(res=>{
                if(res.status===200){
                    return res.json();
                }else{
                    return null;
                }
            }).then(data=>{
                if(data!==null){
                    this.setState({
                        vehicleList:data
                    });
                }
                
            });
    }

    SetPickupDate(date){
        fetch("http://localhost:8080/reservation/check",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    "date":moment(date).format("YYYY/MM/DD"),
                    "numberPlate":this.state.selectVehicle.numberPlate
                })
            }).then(res=>{
                if(res.status===200){
                    this.setState({
                        pickUpdDateError:null,
                        vehicleAvailable:false,
                        pickUpDate:date
                    })
                    console.log("hsfhsf");
                    
                }else if(res.status===404){
                    this.setState({
                        pickUpdDateError:"vehicle not available in particular date",
                        vehicleAvailable:true,
                        pickUpDate:null
                    })
                }
            });
    }

    setDropOffDate(date){
        fetch("http://localhost:8080/reservation/check",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    "date":moment(date).format("YYYY/MM/DD"),
                    "numberPlate":this.state.selectVehicle.numberPlate
                })
            }).then(res=>{
                if(res.status===200){
                    this.setState({
                        dropOffDateError:null,
                        vehicleAvailable:false,
                        dropOffDate:date
                    })
                    console.log("hsfhsf");
                    
                }else if(res.status===404){
                    this.setState({
                        dropOffDateError:"vehicle not available in particular date",
                        vehicleAvailable:true,
                        dropOffDate:null
                    })
                }
            });
    }


    ConfirmBook(e){
        
        if(this.state.customerName===""){
            this.setState({
                customerNameError:"*Required"
            });
        }else{
            this.setState({
                customerNameError:null
            });
        }
        if(this.state.customerNumber===""){
            this.setState({
                customerNumberError:"*Required"
            });
        }else{
            this.setState({
                customerNumberError:null
            });
        }
        if(this.state.pickUpDate===""){
            this.setState({
                pickUpdDateError:"*Required"
            });
        }else{
            this.setState({
                pickUpdDateError:null
            });
        }
        if(this.state.dropOffDate===""){
            this.setState({
                dropOffDateError:"*Required"
            });
        }else{
            this.setState({
                dropOffDateError:null
            });
        }
        if(this.state.customerName!==""&&this.state.customerNumber!==""&&this.state.pickUpDate!==""&&this.state.dropOffDate!==""){
            fetch("http://localhost:8080/reservation/",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    "pickUpDate":moment(this.state.pickUpDate).format("YYYY/MM/DD"),
                    "dropOffDate":moment(this.state.dropOffDate).format("YYYY/MM/DD"),
                    "vehicleNumber":this.state.selectVehicle.numberPlate,
                    "mobileNumber":Number(this.state.customerNumber),
                    "customerName":this.state.customerName
                })
            }).then(res=>{
                if(res.status===201){
                    this.setState({
                        errorBook:""
                    })
                    return res.json();
                }else if(res.status===500){
                    this.setState({
                        errorBook:"*Something went wrong. try again"
                    })
                    return null;
                }else{
                    return null;
                }
            }).then(data=>{
                if(data!==null){
                    toaster.success(
                        'New Vehicle Booked successfully!'
                    );
                    this.setState({
                        show:false
                    });
                }
                
            });
        }
        e.preventDefault();
        
    }

    render() {
        const searchResult = this.state.vehicleList!==null?this.state.vehicleList.filter((item)=>{
            return item.numberPlate.toLowerCase().includes(this.state.search.toLowerCase())&&
            item.vehicleType.includes(this.state.filterVehicleType);
        }):[];
        return (
            <Pane marigntop={12} paddingTop={25}>
                <Pane>
                    <SearchInput placeholder="Number Plate" height={40} marginBottom={40} marignRight={10} onChange={e=>this.setState({
                        search:e.target.value
                    })}
                    value={this.state.search} />
                    <Select width={150} height={40} value={this.state.filterVehicleType} onChange={e=>this.setState({
                        filterVehicleType:e.target.value
                    })} >
                        <option value="" selected>Vehicle Type</option>
                        <option value="CAR">Car</option>
                        <option value="MOTORBIKE">Motorbike</option>
                    </Select>
                </Pane>
                {searchResult!=null?searchResult.map((item)=>
                <this.ItemRow 
                brand={item.brand} 
                model={item.model} 
                type={item.vehicleType} 
                numberPlate={item.numberPlate} 
                seats={item.numberOfSeat} 
                gearType={item.gearType} 
                fuelType={item.fuelType}
                speed={item.maxSpeed}
                category={item.category}
                startType = {item.starting}
                powerType = {item.powerType}
                vehicleItem = {item}
                />):""}
                
                <this.BookBox/>
            </Pane>
        );
    }


    ItemRow(props){
        return(
            <Pane paddingTop={5}>
            <Pane padding={15} border="default" borderRadius={3} display="flex" alignItems="center" width="100%" marign={15} className="card">
                    <img src={props.type==="CAR"?Car:Bike} width="160px" flex={1}/>
                    
                    <Pane flex={1} paddingLeft={20}>
                    <Text fontWeight="600" fontSize="16px">{props.brand+" "+props.model}</Text><br/>
                    <Text background="#E8F5E9" padding={5} fontSize="12px" fontWeight="500" borderRadius={2}>{props.numberPlate}</Text><br/>
                    </Pane>
                    {props.type==="CAR"?
                    <Pane flex={2} display="flex">
                        <Pane flex={1}>
        <Text fontSize="14px" >Maximum Speed - {props.speed}mph</Text><br/>   
        <Text fontSize="14px" >Seats - {props.seats}</Text><br/>
                        </Pane>
                        <Pane flex={1}>
        <Text fontSize="14px" >Gear Type - {props.gearType}</Text><br/>
        <Text fontSize="14px" >Fuel Type - {props.fuelType}</Text>
                        </Pane>

                    </Pane>:
                    <Pane flex={2} display="flex">
                    <Pane flex={1}>
        <Text fontSize="14px" >Maximum Speed - {props.speed}mph</Text><br/>   
        <Text fontSize="14px" >Start Type - {props.startType}</Text><br/>
                    </Pane>
                    <Pane flex={1}>
        <Text fontSize="14px" >Category - {props.category}</Text><br/>
        <Text fontSize="14px" >Power Type - {props.powerType}</Text>
                    </Pane>

                </Pane>
                    }
                    <Pane flex={1}>
                    <Pane backgroundColor="#ffffff" 
                    float="right" 
                    borderRadius={3} 
                    paddingLeft={20}
                     paddingRight={20} 
                     paddingTop={10} 
                     paddingBottom={10} 
                     cursor="pointer"
                     onClick={(e)=>this.setState({
                         show:true,
                         selectVehicle:props.vehicleItem
                     })}>
                         <Text fontSize="15px" color="#0288D1" fontWeight="500">BOOK NOW</Text>
                    </Pane>
                    </Pane>
                    

                </Pane>
                
            </Pane>
        );
    }


    BookBox(props){
        
        return(<SideSheet
            isShown={this.state.show}
            onCloseComplete={() => this.setState({ show:false })}
            containerProps={{
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
            }}
            width={400}
          >
            <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
              <Pane padding={16}>
                <Heading size={600}>Book vehicle</Heading>
                <Paragraph size={400}>
                  
                  <b>{this.state.selectVehicle!==null?this.state.selectVehicle.numberPlate+" ":""}</b>
                  {this.state.selectVehicle!==null?this.state.selectVehicle.brand+" ":""}
                  {this.state.selectVehicle!==null?this.state.selectVehicle.model+" ":""}
                </Paragraph>
              </Pane>
            </Pane>
            <Pane flex="1" overflowY="scroll" background="tint1" padding={16} >
              <Card
                backgroundColor="white"
                elevation={0}
                
                padding={15}
               
                
              >
                <TextInputField
                    required
                    label="Customer Name"
                    description="Booking Customer name"
                    value={this.state.customerName}
                    validationMessage={this.state.customerNameError}
                    onChange={e => this.setState({customerName : e.target.value })}
                />
                <TextInputField
                    required
                    label="Customer Mobile"
                    description="Booking Customer contact number"
                    value={this.state.customerNumber}
                    type="number"
                    validationMessage={this.state.customerNumberError}
                    onChange={e => this.setState({customerNumber : e.target.value })}
                />
                <FormField
                label="Pick Up Date"
                validationMessage={this.state.pickUpdDateError}
                description="Select the vehicle pickup date"
                required
                >
                    <DatePicker
                    dateFormat="yyyy/MM/dd"
                    className="css-5ljhhe 📦color_425A70 📦fnt-fam_b77syt 📦fnt-sze_12px 📦f-wght_400 📦ln-ht_16px 📦ltr-spc_0 📦w_100prcnt 📦h_32px 📦pl_10px 📦pr_10px 📦bblr_3px 📦bbrr_3px 📦btlr_3px 📦btrr_3px 📦box-szg_border-box"
                        selected={this.state.pickUpDate}
                        onChange={(date)=>this.SetPickupDate(date)}
                        
                        
                    />
                </FormField>
                <br/>
                <FormField
                label="Drop Off Date"
                description="Select the vehicle drop off date"
                validationMessage={this.state.dropOffDateError}
                required
                >
                    <DatePicker
                    dateFormat="yyyy/MM/dd"
                    className="css-5ljhhe 📦color_425A70 📦fnt-fam_b77syt 📦fnt-sze_12px 📦f-wght_400 📦ln-ht_16px 📦ltr-spc_0 📦w_100prcnt 📦h_32px 📦pl_10px 📦pr_10px 📦bblr_3px 📦bbrr_3px 📦btlr_3px 📦btrr_3px 📦box-szg_border-box"
                        selected={this.state.dropOffDate}
                        onChange={(date)=>this.setDropOffDate(date)}
                    />
                </FormField>
                <br/>
                    <label>{this.state.errorBook}</label>
                <br/>
                <Button onClick={this.ConfirmBook} appearance="primary" disabled={this.state.vehicleAvailable}>Confirm Book</Button>
               
              </Card>
            </Pane>
          </SideSheet>);
    }
}


export default vehicles
