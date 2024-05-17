// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { InjectRepository } from '@nestjs/typeorm'
// import { Repository } from 'typeorm'
// import { User } from '../../../entities/user.entities'
//
// export class GetUsersQuery {
//   constructor() {}
// }
//
// @QueryHandler(GetUsersQuery)
// export class GetUsersHandler implements IQueryHandler {
//   constructor(@InjectRepository(User) usersRepository: Repository<User>) {}
//
//   execute(query: any): Promise<any> {}
// }
