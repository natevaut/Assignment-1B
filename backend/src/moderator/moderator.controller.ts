import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { UpdateArticleDto } from 'src/models/articles/dto/update-article.dto';
import { QueuedArticleService } from 'src/models/queuedArticles/queuedArticle.service';

//controller- routes articles to get/post methods

@Controller('moderator')
export class ModeratorController {
  constructor(private readonly queuedArticleService: QueuedArticleService) {}

  @Get('/index')
  async getArticles(@Res() response) {
    try {
      const articleData =
        await this.queuedArticleService.getAllUnmoderatedArticles();
      return response.status(HttpStatus.OK).json({
        message: 'All unmoderated articles data found successfully',
        articleData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put('/:id')
  async updateArticle(
    @Res() response,
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      const existingArticle = await this.queuedArticleService.updateArticle(
        articleId,
        updateArticleDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Article has been successfully updated',
        existingArticle,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getArticle(@Res() response, @Param('id') articleId: string) {
    try {
      const existingArticle =
        await this.queuedArticleService.getArticle(articleId);
      return response.status(HttpStatus.OK).json({
        message: 'Article found successfully',
        existingArticle,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteArticle(@Res() response, @Param('id') articleId: string) {
    try {
      const deletedArticle =
        await this.queuedArticleService.deleteArticle(articleId);
      return response.status(HttpStatus.OK).json({
        message: 'Article deleted successfully',
        deletedArticle,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}