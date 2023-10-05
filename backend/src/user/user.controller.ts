import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CreateQueuedArticleDto } from 'src/models/queuedArticles/dto/create-article.dto';
import { ArticleService } from 'src/models/articles/article.service';
import { QueuedArticleService } from 'src/models/queuedArticles/queuedArticle.service';
import { RejectedEntryService } from 'src/models/rejected/rejected.service';

//controller- routes articles to get/post methods

@Controller('articles')
export class UserController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly queuedArticleService: QueuedArticleService,
    private readonly rejectedEntryService: RejectedEntryService,
  ) {}

  @Get()
  async getArticles(@Res() response) {
    try {
      const articleData = await this.articleService.getAllArticles();
      return response.status(HttpStatus.OK).json({
        message: 'All articles data found successfully',
        articleData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/id/:id')
  async getArticle(@Res() response, @Param('id') articleId: string) {
    try {
      const existingArticle = await this.articleService.getArticle(articleId);
      return response.status(HttpStatus.OK).json({
        message: 'Article found successfully',
        existingArticle,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/includes/:id')
  async doesArticleExist(@Res() response, @Param('id') articleId: string) {
    try {
      await this.articleService.getArticle(articleId);
      return response.status(HttpStatus.OK).json({
        message: 'Article found successfully',
        exists: true,
      });
    } catch (err) {
      return response.status(HttpStatus.OK).json({
        message: 'Article does not exist',
        exists: false,
      });
    }
  }

  @Get('/rejected')
  async getRejectedDOIs(@Res() response) {
    try {
      const rejectedEntries = await this.rejectedEntryService.getAllEntries();
      const rejectedDOIs = rejectedEntries.map((item) => item.doi);
      return response.status(HttpStatus.OK).json({
        message: 'Rejected entries found successfully',
        rejectedDOIs,
      });
    } catch (err) {
      return response.status(HttpStatus.OK).json({
        message: 'Failed to fetch rejected entries',
        rejectedDOIs: [],
      });
    }
  }

  @Post('/new')
  async createArticle(@Res() response, @Body() createArticleDto: CreateQueuedArticleDto) {
    try {
      const newArticle = await this.queuedArticleService.createArticle(createArticleDto);
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
}
