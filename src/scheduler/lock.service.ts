import { Injectable } from '@nestjs/common';

@Injectable()
export class CronJobLockService {
  private isRunning = false;

  acquireLock(): boolean {
    if (this.isRunning) {
      return true;
    }

    this.isRunning = true;

    return false;
  }

  releaseLock(): void {
    this.isRunning = false;
  }
}
