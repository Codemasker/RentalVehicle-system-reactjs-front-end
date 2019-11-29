import React from 'react';
import { Pane, Button, Text, Heading,Avatar } from 'evergreen-ui';
import Car from '../attr/car.png';
import Bike from '../attr/bike.png';
import Moment from 'react-moment';

class schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleList :[]
        }
        this.ItemRow = this.ItemRow.bind(this);
    }

    render() {
        return (
            <Pane marigntop={12} paddingTop={25}>
                {this.state.scheduleList!=null?this.state.scheduleList.map((item)=>
                <this.ItemRow brand={item.vehicle.brand} type={item.vehicle.vehicleType} model={item.vehicle.model} pickup={item.pickUpDate} dropoff={item.dropOffDate} customer={item.customerName} contact={item.mobileNumber} numberPlate={item.vehicle.numberPlate} />):""}
                
                
            </Pane>
        );
    }

    

    componentDidMount(){
        fetch("http://localhost:8080/reservation/",{
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
                        scheduleList:data
                    });
                }
                
            });
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
                    <Pane flex={2} display="flex">
                        <Pane flex={1}>
                            <Text fontSize="12px" background="#E8F5E9" padding={5} fontWeight="500" borderRadius={2} >Pick Up</Text><br/>  
                            <Text fontSize="17px" fontWeight="500" color="#263238"><Moment format="YYYY MMMM DD">{props.pickup}</Moment></Text><br/>
                        </Pane>
                        <Pane flex={1}>
                            <Text fontSize="12px" background="#E8F5E9" padding={5} fontWeight="500" borderRadius={2} >Drop Off</Text><br/>  
                            <Text fontSize="17px" fontWeight="500" color="#263238"><Moment format="YYYY MMMM DD">{props.dropoff}</Moment> </Text><br/>
                        </Pane>
                    
                    
                    </Pane>
                    <Pane flex={1}>
                        <Text fontSize="12px" background="#E8F5E9" padding={5} fontWeight="500" borderRadius={2} textalign="right">Booked by</Text><br/>  
                        <Text fontSize="15px" fontWeight="500" color="#263238">{props.customer}</Text><br/>
                         <Text fontSize="14px" fontWeight="500" >{props.contact}</Text><br/>
                    </Pane>
                    

                </Pane>
            </Pane>
        );
    }
}


export default schedule
