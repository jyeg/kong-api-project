import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ServiceGroupService } from '../../modules/service-group/services/service-group.service';
import { User } from '../../modules/user/entities/user.entity';
import { UserService } from '../../modules/user/services/user.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly serviceGroupService: ServiceGroupService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Get the user from the request
    const serviceGroupId = request.params.id; // Get the service group ID from the request parameters

    // Retrieve team members' user IDs
    const teamMembers = await this.userService.findAll({ teamId: user.teamId });
    const teamMemberUserIds = teamMembers.map((teamMember) => teamMember.id);

    // Retrieve the service group
    const serviceGroup = await this.serviceGroupService.findOne(serviceGroupId);

    // Check if the user is the owner or part of the team
    if (
      serviceGroup.userId === user.id ||
      teamMemberUserIds.includes(serviceGroup.userId)
    ) {
      return true; // User is allowed
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
