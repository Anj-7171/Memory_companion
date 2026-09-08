from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import Memory
from schemas.memory import MemoryCreate


def list_memories(db: Session) -> list[Memory]:
    statement = (
        select(Memory)
        .order_by(
            Memory.created_at.desc(),
            Memory.id.desc(),
        )
    )

    return list(
        db.scalars(statement).all()
    )


def get_memory(
    db: Session,
    memory_id: int,
) -> Memory | None:

    return db.get(
        Memory,
        memory_id,
    )


def create_memory(
    db: Session,
    memory_data: MemoryCreate,
) -> Memory:

    memory = Memory(
        **memory_data.model_dump()
    )

    db.add(memory)

    db.commit()

    db.refresh(memory)

    return memory


def delete_memory(
    db: Session,
    memory: Memory,
) -> None:

    db.delete(memory)

    db.commit()