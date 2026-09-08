from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database.database import get_db

from schemas.memory import (
    MemoryCreate,
    MemoryResponse,
)

from services.memory_service import (
    create_memory,
    delete_memory,
    get_memory,
    list_memories,
)


router = APIRouter(
    prefix="/api/memories",
    tags=["memories"],
)


@router.get(
    "",
    response_model=list[MemoryResponse],
)
def read_memories(
    db: Session = Depends(get_db),
):
    return list_memories(db)


@router.post(
    "",
    response_model=MemoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def write_memory(
    memory_data: MemoryCreate,
    db: Session = Depends(get_db),
):
    return create_memory(
        db,
        memory_data,
    )


@router.get(
    "/{memory_id}",
    response_model=MemoryResponse,
)
def read_memory(
    memory_id: int,
    db: Session = Depends(get_db),
):
    memory = get_memory(
        db,
        memory_id,
    )

    if memory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found",
        )

    return memory


@router.delete(
    "/{memory_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_memory(
    memory_id: int,
    db: Session = Depends(get_db),
):
    memory = get_memory(
        db,
        memory_id,
    )

    if memory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found",
        )

    delete_memory(
        db,
        memory,
    )