import { View, Text, Image } from 'react-native'
import React,{useState,useEffect,useCallback} from 'react'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
import ChatFaceData from './ChatFaceData';
import AsyncStorage from '@react-native-async-storage/async-storage';

CHAT_BOT_FACE='https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png'

const Chat = () =>{
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatFaceColor,setChatFaceColor]=useState();

    useEffect(() => {
        checkFaceId();
    }, [])

    const checkFaceId=async()=>{
        const id= await AsyncStorage.getItem('chatFaceId');
       CHAT_BOT_FACE= id?ChatFaceData[id].image: ChatFaceData[0].image;
       setChatFaceColor(ChatFaceData[id].primary);
       setMessages([
        {
          _id: 1,
          text: 'Hello, I am '+ChatFaceData[id].name+', How Can I help you?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: CHAT_BOT_FACE,
        
        },
         
        },
      ])
    }
  
    const onSend = useCallback((messages = []) => {
       
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      if(messages[0].text)
      {
        getBardResp(messages[0].text);
      }
    }, [])

    const getBardResp=(msg)=>{
        console.log(msg)
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            "message": msg
          });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
          fetch("http://192.168.0.118:5000/chat", requestOptions)
          .then((response) => response.json())
          .then((resp) =>{ 
            console.log('....',resp)
         if(resp)
              {
                setLoading(false)
                const chatAIResp={
                    _id: Math.random()* (9999999 - 1),
                    text: `${resp.response}`,
                    createdAt: new Date(),
                    user: {
                      _id: 2,
                      name: 'React Native',
                      avatar: CHAT_BOT_FACE,
                  
                  }
                }
                setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp))  

            }
            else{
                setLoading(false)
                const chatAIResp={
                    _id: Math.random()* (9999999 - 1),
                    text: "Sorry, I can not help with it",
                    createdAt: new Date(),
                    user: {
                      _id: 2,
                      name: 'React Native',
                      avatar: CHAT_BOT_FACE,
                  
                  }
                }
                setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp))  
            }
        })
          .catch((error) => console.error(error));
        
    }

   const renderBubble =(props)=> {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#671ddf',
               
              },left:{
               
              }
             
            }}
            textStyle={{
                right:{
                    // fontSize:20,
                    padding:2
                },
                left: {
                  color: '#671ddf',
                  // fontSize:20,
                  padding:2
                }
              }}
          />
        )
      }

    const  renderInputToolbar =(props)=> {
        //Add the extra styles via containerStyle
       return <InputToolbar {...props} 
       containerStyle={{
       padding:3,
      
        backgroundColor:'#671ddf',
        color:'#fff',
        }} 
        
        textInputStyle={{ color: "#fff" }}
         />
     }

   const  renderSend=(props)=> {
        return (
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 5}}>
                <FontAwesome name="send" size={24} color="white" resizeMode={'center'} />
                   
                </View>
            </Send>
        );
    }
  return (
    <View style={{ flex: 1,backgroundColor:'#fff' }}>

      <GiftedChat
      messages={messages}
      isTyping={loading}
      multiline ={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      
      }}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar} 
      renderSend={renderSend}
    />
    
    
    </View>
  )
}
export default Chat;