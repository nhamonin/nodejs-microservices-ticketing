import { Producer, QueueNames, TicketUpdatedEvent } from '@nh_tickets/common';

export class TicketUpdatedProducer extends Producer<TicketUpdatedEvent> {
  readonly queueName = QueueNames.TICKET_UPDATED;
  readonly exchange = QueueNames.TICKET_UPDATED;
}
