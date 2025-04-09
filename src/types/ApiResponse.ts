// Here I'm defining the type of API Response 
// As we've to show the messages on the dashboard
import { Message } from "@/model/User";

export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages? : boolean;
    messages? : Message[]
}