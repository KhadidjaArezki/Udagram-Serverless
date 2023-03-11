// This is our port to decouple the getting groups logic from the interactions with DynamoDB
import * as uuid from 'uuid'

import { Group } from '../models/Group'
import { GroupAccess } from '../dataLayer/groupsAccess'
import { CreateGroupRequest } from '../requests/createGroupRequest'
import { getUserId } from '../auth/utils'

const groupAccess = new GroupAccess()

export async function getAllGroups(): Promise<Group[]> {
  return groupAccess.getAllGroups()
}

export async function createGroup(
  createGroupRequest: CreateGroupRequest,
  jwtToken: string
): Promise<Group> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description.toLowerCase(),
    timestamp: new Date().toISOString()
  })
}
