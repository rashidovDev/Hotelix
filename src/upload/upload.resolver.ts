import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  // ─── UPLOAD SINGLE IMAGE ─────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => String)
  async uploadImage(
    @Args('file', { type: () => GraphQLUpload })
    file: Promise<FileUpload>,
  ): Promise<string> {
    const { createReadStream, mimetype, filename } = await file;

    // convert stream to buffer
    const buffer = await this.streamToBuffer(createReadStream());

    const multerFile = {
      buffer,
      mimetype,
      originalname: filename,
      size: buffer.length,
    } as Express.Multer.File;

    return this.uploadService.uploadImage(multerFile, 'hotels');
  }

  // ─── UPLOAD MULTIPLE IMAGES ──────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => [String])
  async uploadImages(
    @Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
  ): Promise<string[]> {
    const resolvedFiles = await Promise.all(files);

    const multerFiles = await Promise.all(
      resolvedFiles.map(async ({ createReadStream, mimetype, filename }) => {
        const buffer = await this.streamToBuffer(createReadStream());
        return {
          buffer,
          mimetype,
          originalname: filename,
          size: buffer.length,
        } as Express.Multer.File;
      }),
    );

    return this.uploadService.uploadImages(multerFiles, 'hotels');
  }

  // ─── UPLOAD AVATAR ───────────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => String)
  async uploadAvatar(
    @Args('file', { type: () => GraphQLUpload })
    file: Promise<FileUpload>,
  ): Promise<string> {
    const { createReadStream, mimetype, filename } = await file;

    const buffer = await this.streamToBuffer(createReadStream());

    const multerFile = {
      buffer,
      mimetype,
      originalname: filename,
      size: buffer.length,
    } as Express.Multer.File;

    return this.uploadService.uploadImage(multerFile, 'avatars');
  }

  // ─── HELPER: stream to buffer ─────────────────
  private streamToBuffer(
    stream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}