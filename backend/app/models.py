from sqlalchemy import Column, ForeignKey, Integer, String, Table, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base
from typing import List
from datetime import datetime, timezone
#from pytz import timezone

def current_time():
    return datetime.now(timezone.utc)

profiles_modules = Table(
    'profiles_modules', Base.metadata,
    Column('profile_id', Integer, ForeignKey('profiles.id')),
    Column('module_id', Integer, ForeignKey('modules.id'))
)

modules_transactions = Table(
    'modules_transactions', Base.metadata,
    Column('module_id', Integer, ForeignKey('modules.id')),
    Column('transaction_id', Integer, ForeignKey('transactions.id'))
)

modules_methods = Table(
    'modules_methods', Base.metadata,
    Column('module_id', Integer, ForeignKey('modules.id')),
    Column('method_id', Integer, ForeignKey('methods.id'))
)

class Profile(Base):
    __tablename__ = 'profiles'
    id : Mapped[int] = mapped_column(primary_key = True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime, default=current_time)
    updated_at = Column(DateTime, default=current_time, onupdate=current_time)
    modules: Mapped[List['Module']] = relationship(secondary=profiles_modules)
    users: Mapped[List["User"]] = relationship(back_populates="profile")
    #users = relationship('User', back_populates='profile')
    #modules = relationship('Module', secondary=profiles_modules, back_populates='profiles')

class User(Base):
    __tablename__ = 'users'
    id : Mapped[int] = mapped_column(primary_key = True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    registration = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=current_time)
    updated_at = Column(DateTime, default=current_time, onupdate=current_time)
    profile_id: Mapped[int] = mapped_column(ForeignKey('profiles.id'));
    profile: Mapped["Profile"] = relationship(back_populates="users")
    #profile_id = Column(Integer, ForeignKey('profiles.id'))
    #profile = relationship('Profile', back_populates='users')

class Module(Base):
    __tablename__ = 'modules'
    id : Mapped[int] = mapped_column(primary_key = True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    created_at = Column(DateTime, default=current_time)
    updated_at = Column(DateTime, default=current_time, onupdate=current_time)
    transactions: Mapped[List['Transaction']] = relationship(secondary=modules_transactions)
    methods: Mapped[List['Method']] = relationship(secondary=modules_methods)
    #profiles = relationship('Profile', secondary=profiles_modules, back_populates='modules')
    #transactions = relationship('Transaction', secondary=modules_transactions, back_populates='modules')
    #methods = relationship('Method', secondary=modules_methods, back_populates='modules')

class Transaction(Base):
    __tablename__ = 'transactions'
    id : Mapped[int] = mapped_column(primary_key = True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    created_at = Column(DateTime, default=current_time)
    updated_at = Column(DateTime, default=current_time, onupdate=current_time)
    #modules: Mapped[List['Module']] = relationship(secondary=modules_methods, back_populates="transactions")
    #modules = relationship('Module', secondary=modules_transactions, back_populates='transactions')

class Method(Base):
    __tablename__ = 'methods'
    id : Mapped[int] = mapped_column(primary_key = True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime, default=current_time)
    updated_at = Column(DateTime, default=current_time, onupdate=current_time)
    TAG = Column(String(5), unique=True, nullable=False)
    #modules: Mapped[List['Module']] = relationship(secondary=modules_transactions, back_populates="methods")
    #modules = relationship('Module', secondary=modules_methods, back_populates='methods')