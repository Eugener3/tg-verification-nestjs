import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  private readonly HEADERS = {
    Authorization: `Bearer ${process.env.TOKEN}`,
    'Content-Type': 'application/json',
  };
  constructor(private readonly httpService: HttpService) {}

  // Universal function for sending POST requests
  private async postRequest(endpoint: string, jsonBody: any) {
    const url = `${process.env.BASE_URL}${endpoint}`;
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, jsonBody, {
          headers: this.HEADERS,
        }),
      );
      const data = response.data;
      if (data.ok) {
        return data.result;
      } else {
        throw new HttpException(
          data.error || 'Unknown error',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'Request failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method for sending verification code
  async sendVerificationMessage(phoneNumber: string, payload: string) {
    const endpoint = 'sendVerificationMessage';
    const jsonBody = {
      phone_number: phoneNumber,
      code_length: 6,
      ttl: 3600, // Code lifetime in seconds
      payload,
      callback_url: 'https://6987-178-66-158-75.ngrok-free.app/telegram/auth',
    };
    return await this.postRequest(endpoint, jsonBody);
  }

  // Checking if the user can receive the message
  async checkSendAbility(phoneNumber: string) {
    const endpoint = 'checkSendAbility';
    const jsonBody = { phone_number: phoneNumber };
    return await this.postRequest(endpoint, jsonBody);
  }

  // Checking the verification status
  async checkVerificationStatus(requestId: string, userCode: string) {
    const endpoint = 'checkVerificationStatus';
    const jsonBody = {
      request_id: requestId,
      code: userCode,
    };

    // Send a request for code verification
    const result = await this.postRequest(endpoint, jsonBody);

    // Check status
    const status = result?.verification_status?.status;
    return status === 'code_valid';
  }

  // Revocation of verification code
  async revokeVerificationMessage(requestId: string) {
    const endpoint = 'revokeVerificationMessage';
    const jsonBody = { request_id: requestId };
    return await this.postRequest(endpoint, jsonBody);
  }
}
