import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  Delete,
} from '@nestjs/common';
import { CreateQueuedArticleDto } from 'src/models/queuedArticles/dto/create-article.dto';
import { ArticleService } from 'src/models/articles/article.service';
import { QueuedArticleService } from 'src/models/queuedArticles/queuedArticle.service';
import { Article } from 'src/models/articles/article.schema';

@Controller('analyst')
export class AnalystController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly queuedArticleService: QueuedArticleService,
  ) {}

  @Get('/index')
  async getArticles(@Res() response) {
    try {
      const articleData =
        await this.queuedArticleService.getAllModeratedArticles();
      return response.status(HttpStatus.OK).json({
        message: 'All moderated articles data found successfully',
        articleData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post()
  async createArticle(
    @Res() response,
    @Body() createArticleDto: CreateQueuedArticleDto,
  ) {
    try {
      const newArticle =
        await this.queuedArticleService.createArticle(createArticleDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Article has been created successfully',
        newArticle,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Article not created!',
        error: 'Bad Request',
      });
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

  @Post('/promote/:id')
  async promoteArticle(@Res() response, @Param('id') articleId: string) {
    try {
      // Get article
      const article = await this.queuedArticleService.getArticle(articleId);
      // Add article to accepted database
      await this.articleService.createArticle(article);
      // Delete article from queue
      await this.queuedArticleService.deleteArticle(articleId);
      // Return response
      return response.status(HttpStatus.OK).json({
        message: 'Article promoted to database successfully',
        newArticle: article,
      });
    } catch (err) {
      console.log(err);
      const status =
        err.response?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json(err.response);
    }
  }
}
