import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { URL } from 'url';

@Injectable()
export class ReviewsService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
        this.baseUrl = this.configService.get<string>('GOOGLE_PLACES_BASE_URL');

        if (!this.apiKey) {
            throw new Error('GOOGLE_PLACES_API_KEY não está definida');
        }
        if (!this.baseUrl) {
            throw new Error('GOOGLE_PLACES_BASE_URL não está definida');
        }
    }

    async getPlaceReviews(placeId: string): Promise<any[]> {
        const url = new URL(this.baseUrl);
        url.searchParams.append('place_id', placeId);
        url.searchParams.append('key', this.apiKey);
        url.searchParams.append('fields', 'reviews');

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsedData.result.reviews || []);
                        } else {
                            reject(new HttpException(
                                `Erro ao recuperar os reviews: ${parsedData.error_message || 'Erro desconhecido'}`,
                                res.statusCode
                            ));
                        }
                    } catch (error) {
                        reject(new HttpException(
                            `Erro ao processar a resposta: ${error.message}`,
                            HttpStatus.INTERNAL_SERVER_ERROR
                        ));
                    }
                });
            }).on('error', (error) => {
                reject(new HttpException(
                    `Erro ao conectar com a API do Google Place: ${error.message}`,
                    HttpStatus.SERVICE_UNAVAILABLE
                ));
            });
        });
    }
}