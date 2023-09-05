import { Injectable, Logger } from '@nestjs/common';
import { EventLog } from './entities/event-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventLogDto } from './dtos/create-event-log.dto';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(
    @InjectRepository(EventLog)
    private readonly loggingRepository: Repository<EventLog>,
  ) {}

  async createLog(eventLog: CreateEventLogDto): Promise<void> {
    try {
      this.logger.log(JSON.stringify(eventLog));
      await this.loggingRepository.save(eventLog);
      this.logger.log(`Log created with ID: ${eventLog.id}`);
    } catch (error) {
      this.logger.error(`Error creating log: ${error?.message || error}`);
    }
  }
}
