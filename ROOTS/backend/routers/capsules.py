from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.capsule import CapsuleCreate, CapsuleResponse, CapsuleJoin
from schemas.memory import MemoryResponse
from services.capsule_service import (
    create_capsule,
    get_capsule,
    get_capsule_by_code,
    get_capsule_memories,
    list_capsules,
)

router = APIRouter(
    prefix="/api/capsules",
    tags=["capsules"],
)


@router.get(
    "",
    response_model=list[CapsuleResponse],
)
def read_capsules(
    db: Session = Depends(get_db),
):
    return list_capsules(db)


@router.post(
    "",
    response_model=CapsuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def write_capsule(
    capsule_data: CapsuleCreate,
    db: Session = Depends(get_db),
):
    return create_capsule(db, capsule_data)


@router.post(
    "/join",
    response_model=CapsuleResponse,
)
def join_capsule(
    join_data: CapsuleJoin,
    db: Session = Depends(get_db),
):
    capsule = get_capsule_by_code(db, join_data.invite_code)
    if not capsule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capsule not found with that invite code",
        )
    return capsule


@router.get(
    "/{capsule_id}",
    response_model=CapsuleResponse,
)
def read_capsule(
    capsule_id: int,
    db: Session = Depends(get_db),
):
    capsule = get_capsule(db, capsule_id)
    if not capsule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capsule not found",
        )
    return capsule


@router.get(
    "/{capsule_id}/memories",
    response_model=list[MemoryResponse],
)
def read_capsule_memories(
    capsule_id: int,
    db: Session = Depends(get_db),
):
    capsule = get_capsule(db, capsule_id)
    if not capsule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capsule not found",
        )
    return get_capsule_memories(db, capsule_id)
