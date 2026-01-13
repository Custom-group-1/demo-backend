import { ApiProperty } from '@nestjs/swagger';
import { TeamPreset, TeamMember } from '../../../entities/User';

export class TeamMemberResponseDto {
  @ApiProperty()
  memberId: number;

  @ApiProperty()
  slotIndex: number;

  @ApiProperty()
  inputSpeed: number;

  @ApiProperty()
  characterName: string;

  @ApiProperty({ nullable: true })
  lightconeName: string | null;

  constructor(member: TeamMember) {
    this.memberId = member.memberId!;
    this.slotIndex = member.slotIndex;
    this.inputSpeed = Number(member.inputSpeed);
    this.characterName = member.character!.name;
    this.lightconeName = member.lightcone ? member.lightcone.name : null;
  }
}

export class TeamPresetResponseDto {
  @ApiProperty()
  presetId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string | null;

  @ApiProperty({ type: [TeamMemberResponseDto] })
  members: TeamMemberResponseDto[];

  constructor(preset: TeamPreset) {
    this.presetId = preset.presetId!;
    this.name = preset.name;
    this.username = preset.user ? preset.user.name : null;
    this.members = preset.members.getItems().map(m => new TeamMemberResponseDto(m));
  }
}