import React from 'react';
import { Pane, Button, Text, Heading,Avatar,Tab } from 'evergreen-ui';
import Vehicle from './views/vehicles'
import Schedule from './views/schedule'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab:0
        }

        this.tabController = this.tabController.bind(this);
    }

    render() {
        return (
                <Pane>
                    {/* background header panel */}
                    <Pane width="100%" height={300} backgroundColor="#0288D1">
                    </Pane>
                    <Pane width="1000px" margin="auto" left="0" right="0" top="20px" position="absolute">
                            <Pane display="flex" alignItems="center">
                                {/* Left Panel */} 
                                <Pane display="flex" alignItems="center" flex={1}>
                                <Avatar name="Westminister Rental Vehicle Manager" size={40} marginRight={16} />
                                <Heading color="#ffffff" fontSize="18px" fontWeight="400">Westminister Rental Vehicle Manager</Heading>
                                </Pane>
                                {/* right panel */}
                                <Pane flex={1}>
                                    
                                </Pane>
                            </Pane>

                            {/* Content panel */}
                            <Pane width="100%" borderRadius={5} backgroundColor="#ffffff" elevation={2} marginTop="50px" padding={10} marginBottom={40}>
                                <Pane>
                                    <Tab onSelect={(e)=>this.setState({
                                        currentTab:0
                                    })} fontSize="14px"
                                    isSelected={this.state.currentTab===0?true:false}>Vehicles</Tab>
                                    <Tab onSelect={(e)=>this.setState({
                                        currentTab:1
                                    })} fontSize="14px"
                                    isSelected={this.state.currentTab===1?true:false}>Schedule History</Tab>
                                </Pane>
                                <Pane>
                                    <this.tabController/>
                                    
                                </Pane>
                            </Pane>
                    </Pane>
                </Pane>
        );
    }

    tabController(){
        switch (this.state.currentTab) {
            case 0:
                return <Vehicle/>
            case 1:
                return <Schedule/>
        
            default:
                return <Vehicle/>
        }
    }
}


export default App
