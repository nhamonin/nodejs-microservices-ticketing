import { Producer, QueueNames, TicketCreatedEvent } from '@nh_tickets/common';

export class TicketCreatedProducer extends Producer<TicketCreatedEvent> {
  readonly queueName = QueueNames.TICKET_CREATED;
  readonly exchange = QueueNames.TICKET_CREATED;
}
