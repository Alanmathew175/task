type MessageContent = string | number | boolean;

namespace MessageTypes {
  export type Message<T extends MessageContent> = {
    id: string;
    senderId: string;
    recipientId: string;
    content: T;
    timestamp: Date;
  };


  export type Optional<T> = {
    [P in keyof T]?: T[P];
  };
}


 export function generateId(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const message = originalMethod.apply(this, args);
      message.id = Math.random().toString(36).substr(2, 9); // generate a random ID
      return message;
    };

    return descriptor;
  }
class MessageService {
  messages:MessageTypes.Message<MessageContent>[] = [];

  @generateId
  createMessage(senderId: string, recipientId: string, content: MessageContent): MessageTypes.Message<MessageContent> {
    const message: MessageTypes.Message<MessageContent> = {
      id: "",
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  getMessages(): MessageTypes.Message<MessageContent>[] {
    return this.messages;
  }

  deleteMessage(id: string): void {
    this.messages = this.messages.filter((message) => message.id !== id);
  }
}

const messageService = new MessageService();

const message1 = messageService.createMessage("sender1", "recipient1", "Hello");
const message2 = messageService.createMessage("sender2", "recipient1", 42);
const message3 = messageService.createMessage("sender3", "recipient2", true);

console.log(message1);
console.log(message2);
console.log(message3);

console.log(messageService.getMessages());

messageService.deleteMessage(message2.id);

console.log(messageService.getMessages());

